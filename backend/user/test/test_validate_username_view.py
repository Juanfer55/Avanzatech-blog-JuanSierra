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

class ValidateUsernameTests(APITestCase):
    """
    Test cases for the validate user name view
    """
    def setUp(self):
        """
        Setup function
        """
        self.public_team = TeamsFactory(name='default')
        self.url = reverse('validate-username')
        self.client = APIClient()

    def test_validate_non_existent_username_success(self):

        data = {
            'username': 'test@gmail.com',
        }

        response = self.client.post(self.url, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('IsAvailable' in response.data)
        self.assertEqual(response.data['IsAvailable'], True)

    def test_validate_existing_username_fail(self):

        user = UserFactory(username='test@gmail.com', team=self.public_team)

        data = {
            'username': user.username,
        }

        response = self.client.post(self.url, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('IsAvailable' in response.data)
        self.assertEqual(response.data['IsAvailable'], False)
