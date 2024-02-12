# from django
from django.urls import reverse
# from rest_framework
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from rest_framework import status
# factories
from testing_utilities.factories import TeamsFactory, UserFactory


class LogOutViewTests(APITestCase):
    """
    Test cases for log out view
    """
    def setUp(self):
        """
        Setup function
        """
        self.public_team = TeamsFactory(name='default')
        self.user = UserFactory(username='test@gmail.com', team=self.public_team)
        self.url = reverse('logout')
        self.client = APIClient()

    def test_logout_with_authenticated_user_success(self):
        
        self.client.force_authenticate(user=self.user)

        response = self.client.post(self.url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['success'], 'Successfully logged out')

    def test_logout_with_unauthenticated_user_fail(self):

        response = self.client.post(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertTrue(response.data['error'])
        self.assertEqual(response.data['error'], 'Authentication credentials were not provided')

    def test_logout_with_authenticated_user_invalid_method_fail(self):

        self.client.force_authenticate(user=self.user)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
