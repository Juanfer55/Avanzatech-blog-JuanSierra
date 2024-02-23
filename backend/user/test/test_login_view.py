# from django
from django.urls import reverse
# from rest_framework
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from rest_framework import status
# factories
from testing_utilities.factories import TeamsFactory, UserFactory
# json
import json


class LoginViewTests(APITestCase):
    """
    Test cases for the login view
    """
    def setUp(self):
        """
        Setup function
        """
        self.public_team = TeamsFactory(name='default')
        self.url = reverse('login')
        self.client = APIClient()

    def test_login_with_valid_user_credentials_success(self):
        
        user = UserFactory(username='test@gmail.com', team=self.public_team)

        data = {
            'username': user.username,
            'password': 'defaultpassword'
        }

        response = self.client.post(self.url, json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])

    def test_login_with_invalid_user_credentials_fail(self):

        data = {
            'username': 'test@gmail.com',
            'password': 'defaultpassword'
        }

        response = self.client.post(self.url, json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(response.data['error'])
        self.assertEqual(response.data['error'], 'Incorrect username or password')

    def test_login_with_no_username_fail(self):

        data = {
            'username': '',
            'password': 'defaultpassword'
        }

        response = self.client.post(self.url, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(response.data['error'])
        self.assertEqual(response.data['error'], 'Incorrect username or password')

    def test_login_with_no_password_fail(self):

        user = UserFactory(username='test@gmail.com', team=self.public_team)

        data = {
            'username': user.username,
            'password': ''
        }

        response = self.client.post(self.url, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(response.data['error'])
        self.assertEqual(response.data['error'], 'Incorrect username or password')

    def test_login_with_valid_username_and_invalid_password_fail(self):

        user = UserFactory(username='test@gmail.com', team=self.public_team)

        data = {
            'username': user.username,
            'password': 'Incorrect-password'
        }

        response = self.client.post(self.url, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(response.data['error'])
        self.assertEqual(response.data['error'], 'Incorrect username or password')
