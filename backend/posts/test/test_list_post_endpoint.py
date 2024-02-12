# from django
from django.urls import reverse
# from rest framework
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.test import APITestCase
# test - utilities
from testing_utilities.factories import UserFactory, PostFactory, TeamsFactory, PostsCategoryFactory
from testing_utilities.utils import set_up_test_environment


class ListPostsEndpoint(APITestCase):
    """
    Tests the endpoint for the list Post endpoint.
    """

    def setUp(self):
        """
        Sets up the test enviroment.
        Sets authenticated user for the tests.
        """
        set_up_test_environment(self)
        self.public_team = TeamsFactory(name='Public')
        self.test_team = TeamsFactory(name='Test-Team')
        self.client = APIClient()
        self.user = UserFactory(username='test@gmail.com', team=self.test_team)
        self.client.force_login(self.user)
        self.endpoint = reverse('post-list-create')

    def test_list_posts_whit_public_read_only_permission_unauthenticated_user_success(self):

        self.client.logout()

        for i in range(5):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.public_category,
                permission=self.read_only_permission
            )

        for i in range(5, 10):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.public_category,
                permission=self.read_and_edit_permission
            )

        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 10)

    def test_list_posts_whit_public_read_only_permission_authenticated_user_fail(self):

        for _ in range(5):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.public_category,
                permission=self.read_only_permission
            )

        for _ in range(5, 10):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.public_category,
                permission=self.read_and_edit_permission
            )

        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 0)

    def test_list_post_with_public_none_read_permission_authenticated_user_fail(self):

        for _ in range(10):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.public_category,
                permission=self.none_permission
            )

        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 0)

    def test_list_posts_whit_authenticated_read_permission_authenticated_user_success(self):

        for _ in range(5):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.authenticated_category,
                permission=self.read_only_permission
            )

        for _ in range(5, 10):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.authenticated_category,
                permission=self.read_and_edit_permission
            )

        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 10)

    def test_list_posts_whit_authenticated_read_permission_unauthenticated_user_fail(self):

        self.client.logout()

        for _ in range(5):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.authenticated_category,
                permission=self.read_only_permission
            )

        for _ in range(5, 10):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.authenticated_category,
                permission=self.read_and_edit_permission
            )

        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 0)

    def test_list_post_with_authenticated_none_read_permission_authenticated_user_fail(self):

        for _ in range(10):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.authenticated_category,
                permission=self.none_permission
            )

        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 0)

    def test_list_posts_whit_team_read_permission_authenticated_user_same_team_success(self):

        author = UserFactory(team=self.test_team)

        for _ in range(5):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.team_category,
                permission=self.read_only_permission
            )

        for _ in range(5, 10):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.team_category,
                permission=self.read_and_edit_permission
            )

        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 10)

    def test_list_posts_whit_team_read_permission_authenticated_user_different_team_fail(self):

        author = UserFactory()
        for _ in range(5):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.team_category,
                permission=self.read_only_permission
            )

        for _ in range(5, 10):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.team_category,
                permission=self.read_and_edit_permission
            )
        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 0)

    def test_list_posts_with_team_read_permission_unauthenticated_user_fail(self):

        self.client.logout()

        author = UserFactory()
        for _ in range(10):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.team_category,
                permission=self.read_only_permission
            )

        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 0)

    def test_list_post_with_team_none_read_permission_authenticated_user_same_team_fail(self):

        author = UserFactory(team=self.test_team)
        for _ in range(10):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.team_category,
                permission=self.none_permission
            )

        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 0)

    def test_list_posts_whit_author_read_permission_authenticated_user_same_author_success(self):

        for _ in range(5):
            post = PostFactory(author=self.user)
            # author read-only permission
            PostsCategoryFactory(
                post=post,
                category=self.author_category,
                permission=self.read_only_permission
            )

        for _ in range(5, 10):
            post = PostFactory(author=self.user)
            # author read-edit permission
            PostsCategoryFactory(
                post=post,
                category=self.author_category,
                permission=self.read_and_edit_permission
            )
        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 10)

    def test_list_posts_whit_author_read_permission_authenticated_user_different_author_fail(self):

        author = UserFactory()
        for _ in range(5):
            post = PostFactory(author=author)
            # author read-only permission
            PostsCategoryFactory(
                post=post,
                category=self.author_category,
                permission=self.read_only_permission
            )

        for _ in range(5, 10):
            post = PostFactory(author=author)
            # author read-edit permission
            PostsCategoryFactory(
                post=post,
                category=self.author_category,
                permission=self.read_and_edit_permission
            )
        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 0)

    def test_list_posts_with_author_read_permission_unauthenticated_user_fail(self):

        self.client.logout()

        for _ in range(5):
            post = PostFactory(author=self.user)
            # author read-only permission
            PostsCategoryFactory(
                post=post,
                category=self.author_category,
                permission=self.read_only_permission
            )

        for _ in range(5, 10):
            post = PostFactory(author=self.user)
            # author read-edit permission
            PostsCategoryFactory(
                post=post,
                category=self.author_category,
                permission=self.read_and_edit_permission
            )
        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 0)

    def test_list_post_with_author_none_read_permission_authenticated_user_same_author_fail(self):

        for _ in range(10):
            post = PostFactory(author=self.user)
            PostsCategoryFactory(
                post=post,
                category=self.author_category,
                permission=self.none_permission
            )

        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 0)

    def test_list_posts_with_public_read_permission_admin_user_success(self):

        user = UserFactory(is_admin=True)
        self.client.force_login(user)

        for _ in range(5):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.public_category,
                permission=self.read_only_permission
            )

        for _ in range(5, 10):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.public_category,
                permission=self.read_and_edit_permission
            )

        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 10)

    def test_list_post_with_public_none_read_permission_admin_user_success(self):

        user = UserFactory(is_admin=True)
        self.client.force_login(user)

        for _ in range(10):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.public_category,
                permission=self.none_permission
            )

        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 10)

    def test_list_posts_with_authenticated_read_permission_admin_user_success(self):

        user = UserFactory(is_admin=True)
        self.client.force_login(user)

        for _ in range(5):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.authenticated_category,
                permission=self.read_only_permission
            )

        for _ in range(5, 10):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.authenticated_category,
                permission=self.read_and_edit_permission
            )

        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 10)

    def test_list_post_with_authenticated_none_read_permission_admin_user_success(self):

        user = UserFactory(is_admin=True)
        self.client.force_login(user)

        for _ in range(10):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.authenticated_category,
                permission=self.none_permission
            )

        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 10)

    def test_list_posts_with_team_read_permission_admin_user_different_team_success(self):

        user = UserFactory(is_admin=True)
        self.client.force_login(user)

        for _ in range(5):
            post = PostFactory(author=self.user)
            # team read-only permission
            PostsCategoryFactory(
                post=post,
                category=self.team_category,
                permission=self.read_only_permission
            )

        for _ in range(5, 10):
            post = PostFactory(author=self.user)
            # team read-edit permission
            PostsCategoryFactory(
                post=post,
                category=self.team_category,
                permission=self.read_and_edit_permission
            )

        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 10)

    def test_list_post_with_team_none_read_permission_admin_user_different_team_success(self):

        user = UserFactory(is_admin=True)
        self.client.force_login(user)

        for _ in range(10):
            post = PostFactory(author=self.user)
            # team none permission
            PostsCategoryFactory(
                post=post,
                category=self.team_category,
                permission=self.none_permission
            )

        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 10)

    def test_list_posts_with_author_read_permission_admin_user_different_author_success(self):

        user = UserFactory(is_admin=True)
        self.client.force_login(user)

        for _ in range(5):
            post = PostFactory(author=self.user)
            # author read-only permission
            PostsCategoryFactory(
                post=post,
                category=self.author_category,
                permission=self.read_only_permission
            )

        for _ in range(5, 10):
            post = PostFactory(author=self.user)
            # author read-edit permission
            PostsCategoryFactory(
                post=post,
                category=self.author_category,
                permission=self.read_and_edit_permission
            )

        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 10)

    def test_list_post_with_author_none_read_permission_admin_user_success(self):

        user = UserFactory(is_admin=True)
        self.client.force_login(user)

        for _ in range(10):
            post = PostFactory(author=self.user)
            # author none permission
            PostsCategoryFactory(
                post=post,
                category=self.author_category,
                permission=self.none_permission
            )

        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 10)

    def test_list_pagination_success(self):

        for _ in range(20):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.authenticated_category,
                permission=self.read_only_permission
            )

        response = self.client.get(self.endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('total_count' in response_data)
        self.assertEqual(response_data['total_count'], 20)
        self.assertTrue('current_page' in response_data)
        self.assertEqual(response_data['current_page'], 1)
        self.assertTrue('total_pages' in response_data)
        self.assertEqual(response_data['total_pages'], 2)
        self.assertTrue('next' in response_data)
        self.assertTrue('previous' in response_data)
        self.assertTrue('results' in response_data)
        self.assertEqual(len(response_data['results']), 10)
