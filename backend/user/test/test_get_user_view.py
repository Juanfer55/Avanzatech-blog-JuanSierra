# from django
from django.urls import reverse
# from rest_framework
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from rest_framework import status
# factories
from testing_utilities.factories import TeamsFactory, UserFactory


class GetUserViewTest(APITestCase):
    """
    Test cases for the get user view
    """
    def setUp(self):
        """
        Setup function
        """
        self.public_team = TeamsFactory(name='default')
        self.user = UserFactory(username='test@gmail.com', team=self.public_team)
        self.url = reverse('get-user')
        self.client = APIClient()

    def test_geting_user_with_autehticated_user_credentials_success(self):

        self.client.force_authenticate(user=self.user)

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)
        self.assertEqual(response.data['team']['name'], 'default')
        self.assertEqual(response.data['is_admin'], self.user.is_admin)
        self.assertEqual(response.data['id'], self.user.id)

    def test_geting_user_with_unauthenticated_user_credentials_fail(self):

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertTrue(response.data['error'])
        self.assertEqual(response.data['error'], 'Authentication credentials were not provided')

    def test_geting_user_with_autehticated_user_invalid_method_fail(self):

        self.client.force_authenticate(user=self.user)

        response = self.client.post(self.url)

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
