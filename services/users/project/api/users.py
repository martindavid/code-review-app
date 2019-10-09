from flask import Blueprint, request, render_template
from flask_restful import Resource, Api
from http import HTTPStatus
from project.api.models import User
from project.api.utils import authenticate_restful, is_admin
from project import db
from sqlalchemy import exc

users_blueprint = Blueprint('users', __name__, template_folder='./templates')
api = Api(users_blueprint)


@users_blueprint.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        db.session.add(User(username=username, email=email, password=password))
        db.session.commit()

    users = User.query.all()
    return render_template('index.html', users=users)


class UsersPing(Resource):
    def get(self):
        return {
            'status': 'success',
            'message': 'pong!'
        }


class Users(Resource):
    def get(self, user_id):
        """Get single user details"""
        response_object = {
            'status': 'fail',
            'message': 'User does not exist'
        }
        try:
            user = User.query.filter_by(id=int(user_id)).first()
            if not user:
                return response_object, HTTPStatus.NOT_FOUND
            else:
                response_object = {
                    'status': 'success',
                    'data': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'active': user.active
                    }
                }
                return response_object, HTTPStatus.OK
        except ValueError:
            return response_object, HTTPStatus.NOT_FOUND


class UsersList(Resource):
    method_decorators = {'post': [authenticate_restful]}

    def get(self):
        """Get all users"""
        response_object = {
            'status': 'success',
            'data': {
                'users': [user.to_json() for user in User.query.all()]
            }
        }

        return response_object, HTTPStatus.OK

    def post(self, resp):
        post_data = request.get_json()
        response_object = {
            'status': 'fail',
            'message': 'Invalid payload'
        }
        if not is_admin(resp):
            response_object['message'] = \
                'You do not have permission to do that.'
            return response_object, HTTPStatus.UNAUTHORIZED

        if not post_data:
            return response_object, HTTPStatus.BAD_REQUEST

        username = post_data.get('username')
        email = post_data.get('email')
        password = post_data.get('password')

        try:
            user = User.query.filter_by(email=email).first()
            if not user:
                db.session.add(User(
                    username=username,
                    email=email,
                    password=password))
                db.session.commit()
                response_object['status'] = 'success'
                response_object['message'] = f'{email} was added!'
                return response_object, HTTPStatus.CREATED
            else:
                response_object['message'] = \
                    'Sorry. That email already exists.'
                return response_object, HTTPStatus.BAD_REQUEST
        except (exc.IntegrityError, ValueError):
            db.session.rollback()
            return response_object, HTTPStatus.BAD_REQUEST


api.add_resource(UsersPing, '/users/ping')
api.add_resource(UsersList, '/users')
api.add_resource(Users, '/users/<user_id>')
