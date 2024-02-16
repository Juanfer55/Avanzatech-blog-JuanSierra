# from django
from django.urls import reverse
# from rest framework
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.test import APITestCase
# testing utilities
from testing_utilities.factories import UserFactory, PostFactory, LikesFactory, TeamsFactory, PostsCategoryFactory
from testing_utilities.utils import set_up_test_environment


class UnLikeEndpointTests(APITestCase):
    """
    Test cases for unlike endpoint.
    """
    def setUp(self):
        """
        Sets up the authenticated user for the tests.
        """
        set_up_test_environment(self)
        self.test_team = TeamsFactory(name='Test-Team')
        self.client = APIClient()
        self.user = UserFactory(username='test@gmail.com', team=self.test_team)
        self.client.force_login(self.user)

    def test_unlike_post_with_public_read_only_permission_unauthenticated_user_fail(self):

        self.client.logout()
        post = PostFactory()
        PostsCategoryFactory(
            post=post,
            category = self.public_category,
            permission=self.read_only_permission
        )
        like = LikesFactory(post=post)

        endpoint = reverse('unlike', kwargs={'pk': like.id})

        response = self.client.delete(endpoint)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unlike_post_with_public_read_and_edit_permission_unauthenticated_user_fail(self):

        self.client.logout()
        post = PostFactory()
        PostsCategoryFactory(
            post=post,
            category = self.public_category,
            permission=self.read_and_edit_permission
        )
        like = LikesFactory(post=post)

        endpoint = reverse('unlike', kwargs={'pk': like.id})

        response = self.client.delete(endpoint)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unlike_post_with_public_none_read_or_edit_permission_unauthenticated_user_fail(self):

        self.client.logout()
        post = PostFactory()
        PostsCategoryFactory(
            post=post,
            category = self.public_category,
            permission=self.none_permission
        )
        like = LikesFactory(post=post)

        endpoint = reverse('unlike', kwargs={'pk': like.id})

        response = self.client.delete(endpoint)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unlike_post_with_authenticated_read_only_permission_authenticated_user_success(self):

        post = PostFactory()
        PostsCategoryFactory(
            post=post,
            category = self.authenticated_category,
            permission=self.read_only_permission
        )
        like = LikesFactory(post=post, user=self.user)

        endpoint = reverse('unlike', kwargs={'pk': like.id})

        response = self.client.delete(endpoint)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_unlike_post_with_authenticated_read_and_edit_permission_authenticated_user_success(self):

        post = PostFactory()
        PostsCategoryFactory(
            post=post,
            category = self.authenticated_category,
            permission=self.read_and_edit_permission
        )
        like = LikesFactory(post=post, user=self.user)

        endpoint = reverse('unlike', kwargs={'pk': like.id})

        response = self.client.delete(endpoint)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_unlike_post_with_authenticated_none_read_or_edit_permission_authenticated_user_fail(self):

        post = PostFactory()
        PostsCategoryFactory(
            post=post,
            category = self.authenticated_category,
            permission=self.none_permission
        )
        like = LikesFactory(post=post, user=self.user)

        endpoint = reverse('unlike', kwargs={'pk': like.id})

        response = self.client.delete(endpoint)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unlike_post_with_team_read_only_permission_authenticated_user_same_team_success(self):

        author = UserFactory(team=self.test_team)
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category = self.team_category,
            permission=self.read_only_permission
        )
        like = LikesFactory(post=post, user=self.user)

        endpoint = reverse('unlike', kwargs={'pk': like.id})

        response = self.client.delete(endpoint)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_unlike_post_with_team_read_only_permission_authenticated_user_different_team_fail(self):

        author = UserFactory()
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category = self.team_category,
            permission=self.read_only_permission
        )
        like = LikesFactory(post=post, user=self.user)

        endpoint = reverse('unlike', kwargs={'pk': like.id})

        response = self.client.delete(endpoint)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unlike_post_with_team_read_and_edit_permission_authenticated_user_same_team_success(self):

        author = UserFactory(team=self.test_team)
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category = self.team_category,
            permission=self.read_and_edit_permission
        )
        like = LikesFactory(post=post, user=self.user)

        endpoint = reverse('unlike', kwargs={'pk': like.id})

        response = self.client.delete(endpoint)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_unlike_post_with_team_none_read_or_edit_permission_authenticated_user_same_team_fail(self):

        author = UserFactory(team=self.test_team)
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category = self.team_category,
            permission=self.none_permission
        )
        like = LikesFactory(post=post, user=self.user)

        endpoint = reverse('unlike', kwargs={'pk': like.id})

        response = self.client.delete(endpoint)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unlike_post_with_author_read_only_permission_authenticated_user_same_author_success(self):

        post = PostFactory(author=self.user)
        PostsCategoryFactory(
            post=post,
            category = self.author_category,
            permission=self.read_only_permission
        )
        like = LikesFactory(post=post, user=self.user)

        endpoint = reverse('unlike', kwargs={'pk': like.id})

        response = self.client.delete(endpoint)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_unlike_post_with_author_read_only_permission_authenticated_user_different_author_fail(self):

        author = UserFactory()
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category = self.author_category,
            permission=self.read_only_permission
        )
        like = LikesFactory(post=post, user=self.user)

        endpoint = reverse('unlike', kwargs={'pk': like.id})

        response = self.client.delete(endpoint)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_unlike_post_with_author_read_and_edit_permission_authenticated_user_same_author_success(self):

        post = PostFactory(author=self.user)
        PostsCategoryFactory(
            post=post,
            category = self.author_category,
            permission=self.read_and_edit_permission
        )
        like = LikesFactory(post=post, user=self.user)

        endpoint = reverse('unlike', kwargs={'pk': like.id})

        response = self.client.delete(endpoint)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_unlike_post_with_author_none_read_or_edit_permission_authenticated_user_same_author_fail(self):

        author = UserFactory()
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category = self.author_category,
            permission=self.none_permission
        )
        like = LikesFactory(post=post, user=self.user)

        endpoint = reverse('unlike', kwargs={'pk': like.id})

        response = self.client.delete(endpoint)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)