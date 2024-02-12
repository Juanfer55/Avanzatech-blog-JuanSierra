# From django
from django.urls import reverse
# From rest framework
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.test import APITestCase
# testing - utilities
from testing_utilities.factories import UserFactory
from testing_utilities.utils import set_up_test_environment
import json
# models
from postCategory.models import PostCategory


class CreatePostsEndpoint(APITestCase):
    """
    Tests for creating posts via the API. 
    """

    def setUp(self):
        """
        Sets up the test environment.
        Sets up the authenticated client for the tests.
        """
        set_up_test_environment(self)
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)
        self.endpoint = reverse('post-list-create')


    def test_create_valid_post_and_related_permissions_with_authenticated_user_succes(self):

        data = {
            'title': 'Test title',
            'content': 'a' * 1000,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3 
        }

        response = self.client.post(self.endpoint, data=json.dumps(data), content_type='application/json')

        response_data = response.json()

        permissions_count = PostCategory.objects.filter(post__id=response_data['id']).count()
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_data['title'], data['title'])
        self.assertEqual(response_data['content'], data['content'])
        self.assertEqual(permissions_count, 4)

    def test_create_valid_post_with_unauthenticated_user_fail(self):
        
        self.client.logout()

        data = {
            'title': 'Test title',
            'content': 'a' * 1000,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3 
        }

        response = self.client.post(self.endpoint, data=json.dumps(data), content_type='application/json')


        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_post_blank_title_with_authenticated_user_fail(self):

        data = {
            'title': '',
            'content': 'a' * 1000,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3 
        }

        response = self.client.post(self.endpoint, data=json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['title']
                         [0], 'This field may not be blank.')

    def test_create_post_no_title_with_authenticated_user_fail(self):

        data = {
            'content': 'a' * 1000,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3 
        }

        response = self.client.post(self.endpoint, data=json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['title'][0], 'This field is required.')

    def test_create_post_long_title_with_authenticated_user_fail(self):

        data = {
            'title': 'a' * 51,
            'content': 'a' * 1000,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3 
        }

        response = self.client.post(self.endpoint, data=json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['title'][0], 'Ensure this field has no more than 50 characters.')

    def test_create_post_blank_content_with_authenticated_user_fail(self):

        data = {
            'title': 'Test title',
            'content': '',
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3 
        }

        response = self.client.post(
            self.endpoint, data=json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['content']
                         [0], 'This field may not be blank.')

    def test_create_post_no_content_with_authenticated_user_fail(self):

        data = {
            'title': 'Test title',
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3 
        }

        response = self.client.post(
            self.endpoint, data=json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['content']
                         [0], 'This field is required.')

    def test_create_post_long_content_with_authenticated_user_fail(self):

        data = {
            'title': 'Test title',
            'content': 'a' * 1001,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3 
        }
        
        response = self.client.post(
            self.endpoint, data=json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['content'][0], 'Ensure this field has no more than 1000 characters.')

    def test_create_post_no_public_permission_with_authenticated_user_fail(self):

        data = {
            'title': 'Test title',
            'content': 'a' * 1001,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3 
        }
        
        response = self.client.post(
            self.endpoint, data=json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['public_permission'][0], 'This field is required.')
    
    def test_create_post_with_invalid_public_permission_with_authenticated_user_fail(self):

        data = {
            'title': 'Test title',
            'content': 'a' * 1001,
            'public_permission': 4,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3 
        }
        
        response = self.client.post(
            self.endpoint, data=json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['public_permission'][0], 'Invalid pk "4" - object does not exist.')
        
    def test_create_post_no_authenticated_permission_with_authenticated_user_fail(self):

        data = {
            'title': 'Test title',
            'content': 'a' * 1001,
            'public_permission': 2,
            'team_permission': 3,
            'author_permission': 3 
        }
        
        response = self.client.post(
            self.endpoint, data=json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['authenticated_permission'][0], 'This field is required.')
        
    def test_create_post_with_invalid_authenticated_permission_with_authenticated_user_fail(self):

        data = {
            'title': 'Test title',
            'content': 'a' * 1001,
            'public_permission': 2,
            'authenticated_permission': 4,
            'team_permission': 3,
            'author_permission': 3
        }

        response = self.client.post(
            self.endpoint, data=json.dumps(data), content_type='application/json')
        
        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['authenticated_permission'][0], 'Invalid pk "4" - object does not exist.')
        
    def test_create_post_no_team_permission_with_authenticated_user_fail(self):

        data = {
            'title': 'Test title',
            'content': 'a' * 1001,
            'public_permission': 2,
            'authenticated_permission': 2,
            'author_permission': 3
        }

        response = self.client.post(
            self.endpoint, data=json.dumps(data), content_type='application/json')
        
        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['team_permission'][0], 'This field is required.')
        
    def test_create_post_with_invalid_team_permission_with_authenticated_user_fail(self):

        data = {
            'title': 'Test title',
            'content': 'a' * 1001,
            'public_permission': 2,
            'authenticated_permission': 2,
            'team_permission': 4,
            'author_permission': 3
        }

        response = self.client.post(
            self.endpoint, data=json.dumps(data), content_type='application/json')
        
        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['team_permission'][0], 'Invalid pk "4" - object does not exist.')
        
    def test_create_post_no_author_permission_with_authenticated_user_fail(self):

        data = {
            'title': 'Test title',
            'content': 'a' * 1001,
            'public_permission': 2,
            'authenticated_permission': 2,
            'team_permission': 3
        }

        response = self.client.post(
            self.endpoint, data=json.dumps(data), content_type='application/json')
        
        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['author_permission'][0], 'This field is required.')
        
    def test_create_post_with_invalid_author_permission_with_authenticated_user_fail(self):

        data = {
            'title': 'Test title',
            'content': 'a' * 1001,
            'public_permission': 2,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 4
        }

        response = self.client.post(
            self.endpoint, data=json.dumps(data), content_type='application/json')
        
        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['author_permission'][0], 'Invalid pk "4" - object does not exist.')
    