import json
import unittest

from project.tests.base import BaseTestCase
from project import db
from project.api.models import User


def add_user(username: str, email: str):
    user = User(username=username, email=email)
    db.session.add(user)
    db.session.commit()
    return user


class TestUserService(BaseTestCase):
    """Tests for the Users Service."""

    def test_users(self):
        response = self.client.get('/users/ping')
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertIn('pong!', data['message'])
        self.assertIn('success', data['status'])

    def test_add_user(self):
        """Ensure a new user can be added to the database"""
        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({
                    'username': 'martin',
                    'email': 'mvalentino@martinlabs.me'
                }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 201)
            self.assertIn('mvalentino@martinlabs.me was added', data['message'])
            self.assertIn('success', data['status'])
    
    def test_add_user_invalid_json(self):
        """Ensure error is thrown if the JSON object is empty."""
        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({}),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload', data['message'])
            self.assertIn('fail', data['status'])

    def test_add_user_invalid_json_keys(self):
        """
        Ensure error is thrown if the JSON object does not have a username key
        """
        with self.client:
            response = self.client.post(
                '/users',
                data=json.dumps({ 'email': 'mvalentino@martinlabs.me' }),
                content_type='application/json'
            )
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Invalid payload', data['message'])
            self.assertIn('fail', data['status'])


    def test_add_user_duplicate_email(self):
        """Ensure error is thrown if the email already exists."""
        with self.client:
            self.client.post(
                '/users',
                data=json.dumps({
                    'username': 'mvalentino',
                    'email': 'mvalentino@martinlabs.me'
                }),
                content_type='application/json'
            )

            response = self.client.post(
                '/users',
                data=json.dumps({
                    'username': 'mvalentino',
                    'email': 'mvalentino@martinlabs.me'
                }),
                content_type='application/json'
            )

            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 400)
            self.assertIn('Sorry. That email already exists', data['message'])
            self.assertIn('fail', data['status'])

    def test_single_user(self):
        """Ensure get single user behave correctly."""
        user = add_user('mvalentino', 'mvalentino@martinlabs.me')
        with self.client:
            response = self.client.get(f'/users/{user.id}')
            data = json.loads(response.data.decode())
            self.assertIn('mvalentino', data['data']['username'])
            self.assertIn('mvalentino@martinlabs.me', data['data']['email'])
            self.assertIn('success', data['status'])

    def test_single_user_no_id(self):
        """Ensure error is thrown if an id is not provided"""
        with self.client:
            response = self.client.get('/users/blah')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 404)
            self.assertIn('User does not exist', data['message'])
            self.assertIn('fail', data['status'])

    def test_single_user_incorrect_id(self):
        """Ensure error is thrown if the id does exist."""
        with self.client:
            response = self.client.get('/users/999')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 404)
            self.assertIn('User does not exist', data['message'])
            self.assertIn('fail', data['status'])

    def test_all_users(self):
        """Ensure get all users behave correctly."""
        add_user('mvalentino', 'mvalentino@martinlabs.me')
        add_user('martin.valentino', 'martin.valentino@live.com')
        with self.client:
            response = self.client.get('/users')
            data = json.loads(response.data.decode())
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(data['data']['users']), 2)
            users = data['data']['users']
            self.assertIn('mvalentino', users[0]['username'])
            self.assertIn('mvalentino@martinlabs.me', users[0]['email'])
            self.assertIn('martin.valentino', users[1]['username'])
            self.assertIn('martin.valentino@live.com', users[1]['email'])
            self.assertIn('success', data['status'])

    def test_main_with_users(self):
        """
        Ensure the main route behave correctly when users have been added to the database
        """
        add_user('mvalentino', 'mvalentino@martinlabs.me')
        add_user('martin.valentino', 'martin.valentino@martinlabs.me')
        with self.client:
            response = self.client.get('/')
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'All Users', response.data)
            self.assertNotIn(b'<p>No users!</p>', response.data)
            self.assertIn(b'mvalentino', response.data)
            self.assertIn(b'martin.valentino', response.data)

    def test_main_add_user(self):
        """
        Ensure a new user can be added to the database via a POST request
        """
        with self.client:
            response = self.client.post(
                '/',
                data=dict(username='mvalentino', email='mvalentino@martinlabs.me'),
                follow_redirects=True
            )
            self.assertEqual(response.status_code, 200)
            self.assertIn(b'All Users', response.data)
            self.assertNotIn(b'<p>No users!</p>', response.data)
            self.assertIn(b'mvalentino', response.data)


if __name__ == '__main__':
    unittest.main()
