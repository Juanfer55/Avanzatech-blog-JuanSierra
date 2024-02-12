# from django
from django.urls import reverse
# from rest framework
from rest_framework import status
from rest_framework.test import APITestCase
# testing utilities
from testing_utilities.factories import UserFactory, PostFactory, PostsCategoryFactory
from testing_utilities.utils import set_up_test_environment
# json
import json


class CreateLikeEndpointTests(APITestCase):
    """
    Test cases for create like endpoint.
    """
    def setUp(self):
        """
        Sets up the environment for the tests.
        """
        set_up_test_environment(self)
        self.user = UserFactory(username='test@gmail.com', team=self.default_team)
        self.client.force_login(self.user)
        self.endpoint = reverse('likes-list-filter-create')

    def test_like_post_with_public_read_only_permission_unauthenticated_user_fail(self):

        self.client.logout()
        post = PostFactory()
        PostsCategoryFactory(
            post=post,
            category = self.public_category, 
            permission=self.read_only_permission
        )

        data = {
            'post': post.id,
        }

        response = self.client.post(self.endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_like_post_with_public_read_and_edit_permission_unauthenticated_user_fail(self):

        self.client.logout()
        post = PostFactory()
        PostsCategoryFactory(
            post=post,
            category = self.public_category, 
            permission=self.read_and_edit_permission
        )

        data = {
            'post': post.id,
        }

        response = self.client.post(self.endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_like_post_with_public_none_read_or_edit_permission_unauthenticated_user_fail(self):

        self.client.logout()
        post = PostFactory()
        PostsCategoryFactory(
            post=post,
            category = self.public_category, 
            permission=self.read_and_edit_permission
        )

        data = {
            'post': post.id,
        }

        response = self.client.post(self.endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_like_with_authenticated_read_only_permission_authenticated_user_success(self):

        post = PostFactory()
        PostsCategoryFactory(
            post=post,
            category = self.authenticated_category,
            permission=self.read_only_permission
        )

        data = {
            'post': post.id,
        }

        response = self.client.post(self.endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_like_post_with_authenticated_read_and_edit_permission_authenticated_user_success(self):

        post = PostFactory()
        PostsCategoryFactory(
            post=post,
            category = self.authenticated_category,
            permission=self.read_and_edit_permission
        )

        data = {
            'post': post.id,
        }

        response = self.client.post(self.endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_like_post_with_authenticated_none_read_or_edit_permission_authenticated_user_fail(self):

        post = PostFactory()
        PostsCategoryFactory(
            post=post,
            category = self.authenticated_category,
            permission=self.none_permission
        )

        data = {
            'post': post.id,
        }

        response = self.client.post(self.endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_like_post_with_team_read_only_permission_authenticated_user_same_team_success(self):

        author = UserFactory(username='author@gmail.com', team=self.default_team)
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category = self.team_category,
            permission=self.read_only_permission
        )

        data = {
            'post': post.id,
        }

        response = self.client.post(self.endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_like_post_with_team_read_and_edit_permission_authenticated_user_same_team_success(self):

        author = UserFactory(username='author@gmail.com', team=self.default_team)
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category = self.team_category,
            permission=self.read_and_edit_permission
        )

        data = {
            'post': post.id,
        }

        response = self.client.post(self.endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_like_post_with_team_none_read_or_edit_permission_authenticated_user_same_team_fail(self):

        author = UserFactory(username='author@gmail.com', team=self.default_team)
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category = self.team_category,
            permission=self.none_permission
        )

        data = {
            'post': post.id,
        }

        response = self.client.post(self.endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_like_post_with_author_read_only_permission_authenticated_user_same_author_success(self):

        post = PostFactory(author=self.user)
        PostsCategoryFactory(
            post=post,
            category = self.author_category,
            permission=self.read_only_permission
        )

        data = {
            'post': post.id,
        }

        response = self.client.post(self.endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_like_post_with_author_read_and_edit_permission_authenticated_user_same_author_success(self):

        post = PostFactory(author=self.user)
        PostsCategoryFactory(
            post=post,
            category = self.author_category,
            permission=self.read_and_edit_permission
        )

        data = {
            'post': post.id,
        }

        response = self.client.post(self.endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_like_post_with_author_none_read_or_edit_permission_authenticated_user_same_author_fail(self):

        post = PostFactory(author=self.user)
        PostsCategoryFactory(
            post=post,
            category = self.author_category,
            permission=self.none_permission
        )

        data = {
            'post': post.id,
        }

        response = self.client.post(self.endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_like_twice_a_post_fail(self):

        post = PostFactory()
        PostsCategoryFactory(
            post=post,
            category = self.authenticated_category,
            permission=self.read_and_edit_permission
        )

        data = {
            'post': post.id,
        }

        first_like = self.client.post(self.endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(first_like.status_code, status.HTTP_201_CREATED)

        second_like = self.client.post(self.endpoint, json.dumps(data), content_type='application/json')

        self.assertEqual(second_like.status_code, status.HTTP_400_BAD_REQUEST)
        
