# from django
from django.urls import reverse
# from rest framework
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.test import APITestCase
# testing utilities
from  testing_utilities.factories import UserFactory, PostFactory, CommentsFactory, TeamsFactory, PostsCategoryFactory
from testing_utilities.utils import set_up_test_environment


class ListFilterCommentsEndpoint(APITestCase):
    """
    Tests the endpoint for the list comments endpoint.
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

    def test_list_comments_posts_with_public_read_permission_unauthenticated_user_success(self):

        self.client.logout()
        for i in range(20):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.public_category,
                permission=self.read_only_permission
            )
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 20)

    def test_list_comments_posts_with_public_read_and_edit_permission_unauthenticated_user_success(self):

        self.client.logout()
        for i in range(20):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.public_category,
                permission=self.read_and_edit_permission
            )
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 20)

    def test_list_comments_posts_with_public_none_read_or_edit_permission_unauthenticated_user_fail(self):

        self.client.logout()
        for i in range(20):
            user = UserFactory(username=f'test{i}@gmail.com')
            post = PostFactory(author=user)
            PostsCategoryFactory(
                post=post,
                category=self.public_category,
                permission=self.none_permission
            )
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 0)

    def test_list_comments_posts_with_authenticated_read_only_permission_authenticated_user_success(self):

        for i in range(20):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.authenticated_category,
                permission=self.read_only_permission
            )
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 20)

    def test_list_comments_posts_with_authenticated_read_and_edit_permission_authenticated_user_success(self):

        for i in range(20):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.authenticated_category,
                permission=self.read_and_edit_permission
            )
            comment_user = UserFactory(username=f'comment_user{i}@gmail.com')
            CommentsFactory(post=post, user=comment_user)

        endpoint = reverse('comment-list-filter-create')

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['total_count'], 20)

    def test_list_comments_posts_with_authenticated_none_read_or_edit_permission_authenticated_user_fail(self):

        for i in range(20):
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.authenticated_category,
                permission=self.none_permission
            )
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 0)

    def test_list_comments_posts_with_team_user_read_only_permission_authenticated_user_same_team_success(self):

        author = UserFactory(username='author@gmail.com', team=self.test_team)
        for i in range(20):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.team_category,
                permission=self.read_only_permission
            )
            comment_user = UserFactory(username=f'comment_user{i}@gmail.com')
            CommentsFactory(post=post, user=comment_user)

        endpoint = reverse('comment-list-filter-create')

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 20)

    def test_list_comments_posts_with_team_read_only_permission_authenticated_user_different_team_fail(self):

        author = UserFactory(username='author@gmail.com')
        for i in range(20):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.team_category,
                permission=self.read_only_permission
            )
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 0)

    def test_list_comments_posts_with_team_user_read_and_edit_permission_authenticated_user_same_team_success(self):

        author = UserFactory(username='author@gmail.com', team=self.test_team)
        for i in range(20):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.team_category,
                permission=self.read_and_edit_permission
            )
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 20)

    def test_list_comments_posts_with_team_read_and_edit_permission_authenticated_user_different_team_fail(self):

        author = UserFactory(username='author@gmail.com')
        for i in range(20):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.team_category,
                permission=self.read_and_edit_permission
            )
            comment_user = UserFactory(username=f'comment_user{i}@gmail.com')
            CommentsFactory(post=post, user=comment_user)

        endpoint = reverse('comment-list-filter-create')

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 0)

    def test_list_comments_posts_with_team_none_read_or_edit_permission_authenticated_user_same_team_fail(self):

        author = UserFactory(username='author@gmail.com', team=self.test_team)
        for i in range(20):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.team_category,
                permission=self.none_permission
            )
            comment_user = UserFactory(username=f'comment_user{i}@gmail.com')
            CommentsFactory(post=post, user=comment_user)

        endpoint = reverse('comment-list-filter-create')

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 0)

    def test_list_comments_posts_with_author_read_only_permission_authenticated_user_same_author_success(self):

        for i in range(20):
            post = PostFactory(author=self.user)
            PostsCategoryFactory(
                post=post,
                category=self.author_category,
                permission=self.read_only_permission
            )
            comment_user = UserFactory(username=f'comment_user{i}@gmail.com')
            CommentsFactory(post=post, user=comment_user)

        endpoint = reverse('comment-list-filter-create')

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 20)

    def test_list_comments_posts_with_author_read_only_permission_authenticated_user_different_author_fail(self):

        author = UserFactory(username='author@gmail.com')
        for i in range(20):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.author_category,
                permission=self.read_only_permission
            )
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 0)

    def test_list_comments_posts_with_author_read_and_edit_permission_authenticated_user_same_author_success(self):

        for i in range(20):
            post = PostFactory(author=self.user)
            PostsCategoryFactory(
                post=post,
                category=self.author_category,
                permission=self.read_and_edit_permission
            )
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 20)

    def test_list_comments_posts_with_author_read_and_edit_permission_authenticated_user_different_author_fail(self):

        author = UserFactory(username='author@gmail.com')
        for i in range(20):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.author_category,
                permission=self.read_and_edit_permission
            )
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 0)

    def test_list_comments_posts_with_public_read_only_permission_admin_user_success(self):

        client = APIClient()
        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        client.force_authenticate(user=admin_user)

        author = UserFactory(username='author@gmail.com')
        for i in range(20):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.public_category,
                permission=self.read_only_permission
            )
            comment_user = UserFactory(username=f'comment_user@{i}gmail.com')
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 20)

    def test_list_comments_posts_with_public_read_and_edit_permission_admin_user_success(self):

        client = APIClient()
        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        client.force_authenticate(user=admin_user)

        author = UserFactory(username='author@gmail.com')
        for i in range(20):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.public_category,
                permission=self.read_and_edit_permission
            )
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 20)

    def test_list_comments_posts_with_public_none_read_or_edit_permission_admin_user_success(self):

        client = APIClient()
        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        client.force_authenticate(user=admin_user)

        author = UserFactory(username='author@gmail.com')
        for i in range(20):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.public_category,
                permission=self.none_permission
            )
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 20)

    def test_list_comments_with_authenticated_read_only_permission_admin_user_success(self):

        client = APIClient()
        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        client.force_authenticate(user=admin_user)

        author = UserFactory(username='author@gmail.com')
        for i in range(20):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.authenticated_category,
                permission=self.read_only_permission
            )
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 20)

    def test_list_comments_with_authenticated_read_and_edit_permission_admin_user_success(self):

        client = APIClient()
        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        client.force_authenticate(user=admin_user)

        author = UserFactory(username='author@gmail.com')
        for i in range(20):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.authenticated_category,
                permission=self.read_and_edit_permission
            )
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 20)

    def test_list_comments_with_authenticated_none_read_or_edit_permission_admin_user_success(self):

        client = APIClient()
        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        client.force_authenticate(user=admin_user)

        author = UserFactory(username='author@gmail.com')
        for i in range(20):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.authenticated_category,
                permission=self.none_permission
            )
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 20)

    def test_list_comments_with_team_read_only_permission_admin_user_different_team_success(self):

        client = APIClient()
        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        client.force_authenticate(user=admin_user)

        author = UserFactory(username='author@gmail.com')
        for i in range(20):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.team_category,
                permission=self.read_only_permission
            )
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 20)

    def test_list_comments_with_team_read_and_edit_permission_admin_user_different_team_success(self):

        client = APIClient()
        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        client.force_authenticate(user=admin_user)

        author = UserFactory(username='author@gmail.com')
        for i in range(20):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.team_category,
                permission=self.read_and_edit_permission
            )
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 20)

    def test_list_comments_with_team_none_read_or_edit_permission_admin_user_different_team_success(self):

        client = APIClient()
        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        client.force_authenticate(user=admin_user)

        author = UserFactory(username='author@gmail.com')
        for i in range(20):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.team_category,
                permission=self.none_permission
            )
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 20)

    def test_list_comments_with_author_read_only_permission_admin_user_success(self):

        client = APIClient()
        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        client.force_authenticate(user=admin_user)

        author = UserFactory(username='author@gmail.com')
        for i in range(20):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.author_category,
                permission=self.read_only_permission
            )
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 20)

    def test_list_comments_with_author_read_and_edit_permission_admin_user_success(self):

        client = APIClient()
        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        client.force_authenticate(user=admin_user)

        author = UserFactory(username='author@gmail.com')
        for i in range(20):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.author_category,
                permission=self.read_and_edit_permission
            )
            CommentsFactory(post=post)

        endpoint = reverse('comment-list-filter-create')

        response = client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 20)

    def test_list_comments_with_author_none_read_or_edit_permission_admin_user_success(self):

        client = APIClient()
        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        client.force_authenticate(user=admin_user)

        author = UserFactory(username='author@gmail.com')
        for i in range(20):
            post = PostFactory(author=author)
            PostsCategoryFactory(
                post=post,
                category=self.author_category,
                permission=self.none_permission
            )
            comment_user = UserFactory(username=f'comment_user{i}@gmail.com')
            CommentsFactory(post=post, user=comment_user)

        endpoint = reverse('comment-list-filter-create')

        response = client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 20)

    def test_comment_filter_by_user_id_success(self):

        user_1 = UserFactory(username='user_1@gmail.com')
        user_2 = UserFactory(username='user_2@gmail.com')
        for i in range(20):
            if i % 2 == 0:
                user = user_1
            else:
                user = user_2
            post = PostFactory()
            PostsCategoryFactory(
                post=post,
                category=self.authenticated_category,
                permission=self.read_and_edit_permission
            )
            CommentsFactory(post=post, user=user)

        endpoint = reverse('comment-list-filter-create')

        response = self.client.get(f'{endpoint}?user={user_1.id}')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 10)

    def test_comment_filter_by_post_id_success(self):

        post_1 = PostFactory()
        post_2 = PostFactory()
        PostsCategoryFactory(
                post=post_1,
                category=self.authenticated_category,
                permission=self.read_and_edit_permission
            )
        PostsCategoryFactory(
                post=post_2,
                category=self.authenticated_category,
                permission=self.read_and_edit_permission
            )
        for i in range(20):
            if i % 2 == 0:
                post = post_1
            else:
                post = post_2
            
            user = UserFactory(username=f'user_{i}@gmail.com')
            CommentsFactory(post=post, user=user)

        endpoint = reverse('comment-list-filter-create')

        response = self.client.get(f'{endpoint}?post={post_1.id}')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['total_count'], 10)

    def test_comments_pagination_success(self):

        for i in range(20):
            post = PostFactory(author=self.user)
            PostsCategoryFactory(
                post=post,
                category=self.author_category,
                permission=self.read_and_edit_permission
            )
            CommentsFactory(post=post, user=self.user)

        endpoint = reverse('comment-list-filter-create')

        response = self.client.get(endpoint)

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
