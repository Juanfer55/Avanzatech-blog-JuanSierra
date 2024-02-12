# from django
from django.urls import reverse
# from rest_framework
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from rest_framework import status
# factories
from testing_utilities.factories import TeamsFactory
import json

class RegisterViewTests(APITestCase):
    """
    Test cases for the register view
    """
    def setUp(self):
        """
        Setup function
        """
        self.public_team = TeamsFactory(name='default')
        self.url = reverse('register')
        self.client = APIClient()

    def test_register_with_valid_data_success(self):
        
        data = {
            'username': 'test@gmail.com',
            'password': 'defaultpassword',
        }

        response = self.client.post(self.url, json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['success'], 'Successfully registered')

    def test_register_with_blank_username_fail(self):

        data = {
            'username': '',
            'password': 'defaultpassword',
        }

        response = self.client.post(self.url, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_invalid_email_fail(self):

        data = {
            'username': 'no-valid',
            'password': 'defaultpassword',
        }

        response = self.client.post(self.url, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_blank_password_fail(self):

        data = {
            'username': 'test@gmail.com',
            'password': '',
        }

        response = self.client.post(self.url, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_register_with_short_password_fail(self):

        data = {
            'username': 'test@gmail.com',
            'password': 'Short12',
        }

        response = self.client.post(self.url, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_long_password_fail(self):

        data = {
            'username': 'test@gmail.com',
            'password': 'a' * 129,
        }

        response = self.client.post(self.url, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_with_numeric_password_fail(self):

        data = {
            'username': 'test@gmail.com',
            'password': 123123123,
        }

        response = self.client.post(self.url, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

