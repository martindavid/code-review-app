import json
import unittest
from flask import current_app
from project import db
from project.api.models import User
from project.tests.base import BaseTestCase
from project.tests.utils import add_user


class TestAuthBlueprint(BaseTestCase):
    def test_user_registration(self):
        """
        Ensure user registration can run successfully
        """
        with self.client:
            response = self.client.post(
                '/auth/register',
                data=json.dumps({
                    'username': 'justatest',
                    'email': 'test@test.com',
                    'password': '123456'
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertTrue(response.content_type, 'application/json')
            self.assertTrue(data['status'], 'success')
            self.assertTrue(data['message'], 'Successfully registered.')
            self.assertTrue(data['auth_token'])

    def test_user_registration_duplicate_email(self):
        """
        Ensure no user can register with email already exist in the system
        """
        add_user('duplicateemail', 'duplicateemail@test.com', 'test')
        with self.client:
            response = self.client.post(
                '/auth/register',
                data=json.dumps({
                    'username': 'test',
                    'email': 'duplicateemail@test.com',
                    'password': 'test'
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())

            self.assertEqual(response.status_code, 400)
            self.assertIn(
                'Sorry. That user already exists.', data['message']
            )
            self.assertIn('fail', data['status'])

    def test_user_registration_duplicate_username(self):
        """
        Ensure no user can register with username already exist in the system
        """
        add_user('duplicateusername', 'test@test.com', 'test')
        with self.client:
            response = self.client.post(
                '/auth/register',
                data=json.dumps({
                    'username': 'duplicateusername',
                    'email': 'test@test2.com',
                    'password': 'test'
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn(
                'Sorry. That user already exists.', data['message']
            )
            self.assertIn('fail', data['status'])

    def test_user_registration_invalid_json(self):
        """
        Ensure user registration request not contain invalid json
        """
        with self.client:
            response = self.client.post(
                '/auth/register',
                data=json.dumps({}),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload', data['message'])
            self.assertIn('fail', data['status'])

    def test_user_registration_invalid_json_keys_no_email(self):
        """
        Ensure user registration request not missing email field
        """
        with self.client:
            response = self.client.post(
                '/auth/register',
                data=json.dumps({
                    'username': 'justatest',
                    'password': 'test'
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload', data['message'])
            self.assertIn('fail', data['status'])

    def test_user_registration_invalid_json_keys_no_username(self):
        """
        Ensure user registration request not missing username field
        """
        with self.client:
            response = self.client.post(
                '/auth/register',
                data=json.dumps({
                    'email': 'test@test.com',
                    'password': 'test'
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload', data['message'])
            self.assertIn('fail', data['status'])

    def test_registered_user_login(self):
        """
        Ensure registered user can login and return auth_token
        """
        with self.client:
            add_user('test', 'test@test.com', 'test')
            response = self.client.post(
                '/auth/login',
                data=json.dumps({
                    'email': 'test@test.com',
                    'password': 'test'
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertTrue(response.content_type == 'application/json')
            self.assertTrue(data['status'] == 'success')
            self.assertTrue(data['message'] == 'Successfully logged in.')
            self.assertTrue(data['auth_token'])

    def test_not_registered_user_login(self):
        """
        Ensure only registered user can login
development        """
        with self.client:
            response = self.client.post(
                '/auth/login',
                data=json.dumps({
                    'email': 'test@test.com',
                    'password': 'test'
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 404)
            self.assertTrue(response.content_type == 'application/json')
            self.assertTrue(data['status'] == 'fail')
            self.assertTrue(data['message'] == 'User does not exist.')

    def test_valid_logout(self):
        """
        Ensure user with valid auth_token can logout
        """
        add_user('test', 'test@test.com', 'test')
        with self.client:
            resp_login = self.client.post(
                '/auth/login',
                data=json.dumps({
                    'email': 'test@test.com',
                    'password': 'test'
                }),
                content_type='application/json'
            )

            # valid token logout
            token = json.loads(resp_login.data.decode())['auth_token']
            response = self.client.get(
                '/auth/logout',
                headers={'Authorization': f'Bearer {token}'}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data['status'], 'success')
            self.assertTrue(data['message'], 'Successfully logged out.')
            self.assertEqual(response.status_code, 200)

    def test_invalid_logout(self):
        """
        Ensure user with invalid token can't logout
        """
        with self.client:
            response = self.client.get(
                '/auth/logout',
                headers={'Authorization': f'Bearer invalid'}
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 401)
            self.assertTrue(data['status'] == 'fail')
            self.assertTrue(
                data['message'] == 'Invalid token. Please log in again.'
            )

    def test_invalid_logout_expired_token(self):
        """
        Ensure user with expired token can't logout
        """
        add_user('test', 'test@test.com', 'test')
        current_app.config['TOKEN_EXPIRATION_SECONDS'] = -1
        with self.client:
            resp_login = self.client.post(
                '/auth/login',
                data=json.dumps({
                    'email': 'test@test.com',
                    'password': 'test'
                }),
                content_type='application/json'
            )

            token = json.loads(resp_login.data.decode())['auth_token']
            response = self.client.get(
                '/auth/logout',
                headers={'Authorization': f'Bearer {token}'}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data['status'], 'fail')
            self.assertTrue(
                data['message'] == 'Signature expired. Please log in again.'
            )
            self.assertEqual(response.status_code, 401)

    def test_user_status(self):
        """
        Ensure user can get the status
        """
        add_user('test', 'test@test.com', 'test')
        with self.client:
            resp_login = self.client.post(
                '/auth/login',
                data=json.dumps({
                    'email': 'test@test.com',
                    'password': 'test'
                }),
                content_type='application/json'
            )
            token = json.loads(resp_login.data.decode())['auth_token']
            response = self.client.get(
                '/auth/status',
                headers={'Authorization': f'Bearer {token}'}
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertTrue(data['status'] == 'success')
            self.assertTrue(data['data'] is not None)
            self.assertTrue(data['data']['username'] == 'test')
            self.assertTrue(data['data']['email'] == 'test@test.com')
            self.assertTrue(data['data']['active'])

    def test_invalid_status(self):
        with self.client:
            response = self.client.get(
                '/auth/status',
                headers={'Authorization': 'Bearer invalid'}
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 401)
            self.assertTrue(data['status'] == 'fail')
            self.assertTrue(
                data['message'] == 'Invalid token. Please log in again.'
            )

    def test_invalid_logout_inactive(self):
        add_user('test', 'test@test.com', 'test')
        # update user
        user = User.query.filter_by(email='test@test.com').first()
        user.active = False
        db.session.commit()
        with self.client:
            resp_login = self.client.post(
                '/auth/login',
                data=json.dumps({
                    'email': 'test@test.com',
                    'password': 'test'
                }),
                content_type='application/json'
            )
            token = json.loads(resp_login.data.decode())['auth_token']
            response = self.client.get(
                '/auth/logout',
                headers={'Authorization': f'Bearer {token}'}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data['status'] == 'fail')
            self.assertTrue(data['message'] == 'Provide a valid auth token.')
            self.assertEqual(response.status_code, 401)

    def test_invalid_status_inactive(self):
        add_user('test', 'test@test.com', 'test')
        # update user
        user = User.query.filter_by(email='test@test.com').first()
        user.active = False
        db.session.commit()
        with self.client:
            resp_login = self.client.post(
                '/auth/login',
                data=json.dumps({
                    'email': 'test@test.com',
                    'password': 'test'
                }),
                content_type='application/json'
            )
            token = json.loads(resp_login.data.decode())['auth_token']
            response = self.client.get(
                '/auth/status',
                headers={'Authorization': f'Bearer {token}'}
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 401)
            self.assertTrue(data['status'] == 'fail')
            self.assertTrue(data['message'] == 'Provide a valid auth token.')


if __name__ == '__main__':
    unittest.main()
