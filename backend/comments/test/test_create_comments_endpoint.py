# from django
from django.urls import reverse
# from rest framework
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.test import APITestCase
# test utilities
from testing_utilities.factories import UserFactory, PostFactory, TeamsFactory, PostsCategoryFactory
from testing_utilities.utils import set_up_test_environment
# json
import json


class CreateCommentsEndpointTests(APITestCase):
    """
    Tests the create comments endpoint.
    """
    def setUp(self):
        """
        Sets the environment for the tests.
        Sets up the authenticated user for the tests.
        """
        set_up_test_environment(self)
        self.test_team = TeamsFactory(name='Test-Team')
        self.client = APIClient()
        self.user = UserFactory(username='test@gmail.com', team=self.test_team)
        self.client.force_login(self.user)

    def test_comment_post_with_public_read_permission_unauthenticated_user_fail(self):

        self.client.logout()
        post = PostFactory(title='post 1')
        PostsCategoryFactory(
            post=post, 
            category=self.public_category, 
            permission=self.read_only_permission
        )

        endpoint = reverse('comment-list-filter-create')

        data = {
            'post': post.id,
            'content': 'comment 1'
        }

        response = self.client.post(endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_comment_post_with_public_read_and_edit_permission_unauthenticated_user_fail(self):

        self.client.logout()
        post = PostFactory(title='post 1')
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.read_and_edit_permission
        )

        endpoint = reverse('comment-list-filter-create')

        data = {
            'post': post.id,
            'content': 'comment 1'
        }

        response = self.client.post(endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_comment_post_with_public_none_read_or_edit_permission_unauthenticated_user_fail(self):

        self.client.logout()
        post = PostFactory(title='post 1')
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.none_permission
        )

        endpoint = reverse('comment-list-filter-create')

        data = {
            'post': post.id,
            'content': 'comment 1'
        }

        response = self.client.post(endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_comment_post_with_authenticated_read_only_permission_authenticated_user_succes(self):

        post = PostFactory(title='post 1')
        PostsCategoryFactory(
            post=post,
            category=self.authenticated_category,
            permission=self.read_only_permission
        )

        endpoint = reverse('comment-list-filter-create')

        data = {
            'post': post.id,
            'content': 'comment 1'
        }

        response = self.client.post(endpoint, json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_data['content'], 'comment 1')
        self.assertEqual(response_data['post'], post.id)
        self.assertEqual(response_data['user']['username'], self.user.username)
        self.assertEqual(response_data['user']['team']['name'], 'Test-Team')

    def test_comment_post_with_authenticated_read_and_edit_permission_authenticated_user_succes(self):

        post = PostFactory(title='post 1')
        PostsCategoryFactory(
            post=post,
            category=self.authenticated_category,
            permission=self.read_and_edit_permission
        )

        endpoint = reverse('comment-list-filter-create')

        data = {
            'post': post.id,
            'content': 'comment 1'
        }

        response = self.client.post(endpoint, json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_data['content'], 'comment 1')
        self.assertEqual(response_data['post'], post.id)
        self.assertEqual(response_data['user']['username'], self.user.username)
        self.assertEqual(response_data['user']['team']['name'], 'Test-Team')

    def test_comment_post_with_authenticated_none_read_or_edit_permission_authenticated_user_fail(self):

        post = PostFactory(title='post 1')
        PostsCategoryFactory(
            post=post,
            category=self.authenticated_category,
            permission=self.none_permission
        )

        endpoint = reverse('comment-list-filter-create')

        data = {
            'post': post.id,
            'content': 'comment 1'
        }

        response = self.client.post(endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_comment_post_with_team_read_only_permission_authenticated_user_same_team_succes(self):

        author = UserFactory(username='author@gmail.com', team=self.test_team)
        post = PostFactory(title='post 1', author=author)
        PostsCategoryFactory(
            post=post,
            category=self.team_category,
            permission=self.read_only_permission
        )

        endpoint = reverse('comment-list-filter-create')

        data = {
            'post': post.id,
            'content': 'comment 1',
        }

        response = self.client.post(endpoint, json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_data['content'], 'comment 1')
        self.assertEqual(response_data['post'], post.id)
        self.assertEqual(response_data['user']['username'], 'test@gmail.com')
        self.assertEqual(response_data['user']['team']['name'], 'Test-Team')

    def test_comment_post_with_team_read_only_permission_authenticated_user_different_team_fail(self):

        author = UserFactory(username='author@gmail.com')
        post = PostFactory(title='post 1', author=author)
        PostsCategoryFactory(
            post=post,
            category=self.team_category,
            permission=self.read_only_permission
        )

        endpoint = reverse('comment-list-filter-create')

        data = {
            'post': post.id,
            'content': 'comment 1',
        }

        response = self.client.post(endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_comment_post_with_team_user_read_and_edit_permission_authenticated_user_same_team_succes(self):

        author = UserFactory(username='author@gmail.com', team=self.test_team)
        post = PostFactory(title='post 1', author=author)
        PostsCategoryFactory(
            post=post,
            category=self.team_category,
            permission=self.read_and_edit_permission
        )

        endpoint = reverse('comment-list-filter-create')

        data = {
            'post': post.id,
            'content': 'comment 1',
        }

        response = self.client.post(endpoint, json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_data['content'], 'comment 1')
        self.assertEqual(response_data['post'], post.id)
        self.assertEqual(response_data['user']['username'], 'test@gmail.com')
        self.assertEqual(response_data['user']['team']['name'], 'Test-Team')

    def test_comment_post_with_team_user_read_and_edit_permission_authenticated_user_different_team_fail(self):

        author = UserFactory(username='author@gmail.com')
        post = PostFactory(title='post 1', author=author)
        PostsCategoryFactory(
            post=post,
            category=self.team_category,
            permission=self.read_and_edit_permission
        )

        endpoint = reverse('comment-list-filter-create')

        data = {
            'post': post.id,
            'content': 'comment 1',
        }

        response = self.client.post(endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_comment_post_with_team_none_permission_authenticated_user_same_team_fail(self):

        author = UserFactory(username='author@gmail.com', team=self.test_team)
        post = PostFactory(title='post 1')
        PostsCategoryFactory(
            post=post,
            category=self.team_category,
            permission=self.none_permission
        )

        endpoint = reverse('comment-list-filter-create')

        data = {
            'post': post.id,
            'content': 'comment 1',
        }

        response = self.client.post(endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_comment_post_with_author_read_only_permission_authenticated_user_different_author_succes(self):

        post = PostFactory(title='post 1', author=self.user)
        PostsCategoryFactory(
            post=post,
            category=self.author_category,
            permission=self.read_only_permission
        )

        endpoint = reverse('comment-list-filter-create')

        data = {
            'post': post.id,
            'content': 'comment 1',
        }

        response = self.client.post(endpoint, json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_data['content'], 'comment 1')
        self.assertEqual(response_data['post'], post.id)
        self.assertEqual(response_data['user']['username'], 'test@gmail.com')
        self.assertEqual(response_data['user']['team']['name'], 'Test-Team')

    def test_comment_post_with_author_read_only_permission_authenticated_user_different_author_fail(self):

        post = PostFactory(title='post 1')
        PostsCategoryFactory(
            post=post,
            category=self.author_category,
            permission=self.read_only_permission
        )

        endpoint = reverse('comment-list-filter-create')

        data = {
            'post': post.id,
            'content': 'comment 1',
        }

        response = self.client.post(endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_comment_post_with_author_read_and_edit_permission_authenticated_user_same_author_succes(self):

        post = PostFactory(title='post 1', author=self.user)
        PostsCategoryFactory(
            post=post,
            category=self.author_category,
            permission=self.read_and_edit_permission
        )

        endpoint = reverse('comment-list-filter-create')

        data = {
            'post': post.id,
            'content': 'comment 1',
        }

        response = self.client.post(endpoint, json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response_data['content'], 'comment 1')
        self.assertEqual(response_data['post'], post.id)
        self.assertEqual(response_data['user']['username'], 'test@gmail.com')
        self.assertEqual(response_data['user']['team']['name'], 'Test-Team')

    def test_comment_post_with_author_read_and_edit_permission_authenticated_user_different_author_fail(self):

        post = PostFactory(title='post 1')
        PostsCategoryFactory(
            post=post,
            category=self.author_category,
            permission=self.read_and_edit_permission
        )

        endpoint = reverse('comment-list-filter-create')

        data = {
            'post': post.id,
            'content': 'comment 1',
        }

        response = self.client.post(endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_comment_post_with_author_none_read_or_edit_permission_authenticated_user_same_author_fail(self):

        post = PostFactory(title='post 1', author=self.user)
        PostsCategoryFactory(
            post=post,
            category=self.author_category,
            permission=self.none_permission
        )

        endpoint = reverse('comment-list-filter-create')

        data = {
            'post': post.id,
            'content': 'comment 1',
        }

        response = self.client.post(endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
