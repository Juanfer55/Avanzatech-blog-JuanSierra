# from django
from django.urls import reverse
# from rest framework
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.test import APITestCase
# test utilities
from testing_utilities.factories import UserFactory, PostFactory, TeamsFactory, PostsCategoryFactory
from testing_utilities.utils import set_up_test_environment


class PostDetailEndpointTest(APITestCase):
    """
    Tests for retrieving posts via the API.
    """
    def setUp(self):
        """
        Sets up the test environment.
        Sets up the authenticated user for the tests.
        """
        set_up_test_environment(self)
        self.test_team = TeamsFactory(name='Test-Team')
        self.client = APIClient()
        self.user = UserFactory(username='test@gmail.com', team=self.test_team)
        self.client.force_login(self.user)

    def test_detail_post_whit_public_read_only_permission_unauthenticated_user_success(self):

        self.client.logout()

        author = UserFactory(username='author@gmail.com')
        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = author
        )
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.read_only_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'author@gmail.com')
        self.assertEqual(response_data['public_permission'], 'read-only')
        self.assertTrue('authenticated_permission' in response_data)
        self.assertTrue('team_permission' in response_data)
        self.assertTrue('author_permission' in response_data)

    def test_detail_post_whit_public_read_and_edit_permission_unauthenticated_user_success(self):

        self.client.logout()

        author = UserFactory(username='author@gmail.com')
        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = author
        )
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.read_and_edit_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'author@gmail.com')
        self.assertEqual(response_data['public_permission'], 'read-and-edit')
        self.assertTrue('authenticated_permission' in response_data)
        self.assertTrue('team_permission' in response_data)
        self.assertTrue('author_permission' in response_data)


    def test_detail_post_whit_public_none_read_permission_unauthenticated_user_fail(self):

        self.client.logout()

        author = UserFactory(username='author@gmail.com')
        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = author
        )
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.none_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_detail_post_whit_authenticated_read_only_permission_authenticated_user_success(self):

        author = UserFactory(username='author@gmail.com')
        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = author
        )
        PostsCategoryFactory(
            post=post,
            category=self.authenticated_category,
            permission=self.read_only_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'author@gmail.com')
        self.assertEqual(response_data['authenticated_permission'], 'read-only')
        self.assertTrue('public_permission' in response_data)
        self.assertTrue('team_permission' in response_data)
        self.assertTrue('author_permission' in response_data)

    def test_detail_post_whit_authenticated_read_and_edit_permission_authenticated_user_success(self):

        author = UserFactory(username='author@gmail.com')
        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = author
        )
        PostsCategoryFactory(
            post=post,
            category=self.authenticated_category,
            permission=self.read_and_edit_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'author@gmail.com')
        self.assertEqual(response_data['authenticated_permission'], 'read-and-edit')
        self.assertTrue('public_permission' in response_data)
        self.assertTrue('team_permission' in response_data)
        self.assertTrue('author_permission' in response_data)

    def test_detail_post_whit_authenticated_read_only_permission_unauthenticated_user_fail(self):

        self.client.logout()

        author = UserFactory(username='author@gmail.com')
        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = author
        )
        PostsCategoryFactory(
            post=post,
            category=self.authenticated_category,
            permission=self.read_only_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_detail_post_whit_authenticated_read_and_edit_permission_unauthenticated_user_fail(self):

        self.client.logout()

        author = UserFactory(username='author@gmail.com')
        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = author
        )
        PostsCategoryFactory(
            post=post,
            category=self.authenticated_category,
            permission=self.read_and_edit_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_detail_post_whit_authenticated_none_read_permission_authenticated_user_success(self):

        author = UserFactory(username='author@gmail.com')
        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = author
        )
        PostsCategoryFactory(
            post=post,
            category=self.authenticated_category,
            permission=self.none_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
    def test_detail_post_whit_team_read_only_permission_authenticated_user_same_team_success(self):

        author = UserFactory(username='author@gmail.com', team=self.test_team)
        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = author
        )
        PostsCategoryFactory(
            post=post,
            category=self.team_category,
            permission=self.read_only_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'author@gmail.com')
        self.assertEqual(response_data['team_permission'], 'read-only')
        self.assertTrue('public_permission' in response_data)
        self.assertTrue('authenticated_permission' in response_data)
        self.assertTrue('author_permission' in response_data)

    def test_detail_post_whit_team_read_only_permission_authenticated_user_different_team_fail(self):

        author = UserFactory(username='author@gmail.com')
        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = author
        )
        PostsCategoryFactory(
            post=post,
            category=self.team_category,
            permission=self.read_only_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_detail_post_whit_team_read_and_edit_permission_authenticated_user_same_team_success(self):

        author = UserFactory(username='author@gmail.com', team=self.test_team)
        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = author
        )
        PostsCategoryFactory(
            post=post,
            category=self.team_category,
            permission=self.read_and_edit_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'author@gmail.com')
        self.assertEqual(response_data['team_permission'], 'read-and-edit')
        self.assertTrue('public_permission' in response_data)
        self.assertTrue('authenticated_permission' in response_data)
        self.assertTrue('author_permission' in response_data)

    def test_detail_post_whit_team_read_only_permission_unauthenticated_user_fail(self):

        self.client.logout()

        author = UserFactory(username='author@gmail.com')
        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = author
        )
        PostsCategoryFactory(
            post=post,
            category=self.team_category,
            permission=self.read_only_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_detail_post_whit_team_read_and_edit_permission_unauthenticated_user_fail(self):

        self.client.logout()

        author = UserFactory(username='author@gmail.com')
        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = author
        )
        PostsCategoryFactory(
            post=post,
            category=self.team_category,
            permission=self.read_and_edit_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_detail_post_whit_team_none_read_permission_authenticated_user_succes(self):

        author = UserFactory(username='author@gmail.com')
        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = author
        )
        PostsCategoryFactory(
            post=post,
            category=self.team_category,
            permission=self.none_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
    def test_detail_post_whit_author_read_only_permission_authenticated_user_same_author_success(self):

        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = self.user
        )
        PostsCategoryFactory(
            post=post,
            category=self.author_category,
            permission=self.read_only_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'test@gmail.com')
        self.assertEqual(response_data['author_permission'], 'read-only')
        self.assertTrue('public_permission' in response_data)
        self.assertTrue('team_permission' in response_data)
        self.assertTrue('authenticated_permission' in response_data)

    def test_detail_post_whit_author_read_only_permission_authenticated_user_different_author_fail(self):

        author = UserFactory(username='author@gmail.com')
        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = author
        )
        PostsCategoryFactory(
            post=post,
            category=self.author_category,
            permission=self.read_only_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_detail_post_whit_author_read_and_edit_permission_authenticated_user_same_author_success(self):

        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = self.user
        )
        PostsCategoryFactory(
            post=post,
            category=self.author_category,
            permission=self.read_and_edit_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'test@gmail.com')
        self.assertEqual(response_data['author_permission'], 'read-and-edit')
        self.assertTrue('public_permission' in response_data)
        self.assertTrue('team_permission' in response_data)
        self.assertTrue('authenticated_permission' in response_data)

    def test_detail_post_whit_author_read_only_permission_unauthenticated_user_fail(self):

        self.client.logout()

        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = self.user
        )
        PostsCategoryFactory(
            post=post,
            category=self.author_category,
            permission=self.read_only_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_detail_post_whit_team_read_and_edit_permission_unauthenticated_user_fail(self):

        self.client.logout()

        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = self.user
        )
        PostsCategoryFactory(
            post=post,
            category=self.author_category,
            permission=self.read_and_edit_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_detail_post_whit_author_none_read_permission_authenticated_user_same_author_succes(self):

        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = self.user
        )
        PostsCategoryFactory(
            post=post,
            category=self.team_category,
            permission=self.none_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
    def test_detail_post_whit_public_read_only_permission_admin_user_success(self):

        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        self.client.force_login(user=admin_user)

        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = self.user
        )
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.read_only_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'test@gmail.com')
        self.assertEqual(response_data['public_permission'],'read-only')
        self.assertTrue('author_permission' in response_data)
        self.assertTrue('team_permission' in response_data)
        self.assertTrue('authenticated_permission' in response_data)


    def test_detail_post_whit_public_read_and_edit_permission_admin_user_success(self):

        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        self.client.force_login(user=admin_user)

        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = self.user
        )
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.read_and_edit_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'test@gmail.com')
        self.assertEqual(response_data['public_permission'],'read-and-edit')
        self.assertTrue('author_permission' in response_data)
        self.assertTrue('team_permission' in response_data)
        self.assertTrue('authenticated_permission' in response_data)
        
    def test_detail_post_with_public_none_read_permission_admin_user_success(self):

        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        self.client.force_login(user=admin_user)

        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = self.user
        )
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.none_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'test@gmail.com')
        self.assertEqual(response_data['public_permission'], 'none')
        self.assertTrue('author_permission' in response_data)
        self.assertTrue('team_permission' in response_data)
        self.assertTrue('authenticated_permission' in response_data)

    def test_detail_post_whit_authenticated_read_only_permission_admin_user_success(self):

        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        self.client.force_login(user=admin_user)

        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = self.user
        )
        PostsCategoryFactory(
            post=post,
            category=self.authenticated_category,
            permission=self.read_only_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'test@gmail.com')
        self.assertEqual(response_data['authenticated_permission'],'read-only')
        self.assertTrue('author_permission' in response_data)
        self.assertTrue('team_permission' in response_data)
        self.assertTrue('public_permission' in response_data)


    def test_detail_post_whit_authenticated_read_and_edit_permission_admin_user_success(self):

        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        self.client.force_login(user=admin_user)

        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = self.user
        )
        PostsCategoryFactory(
            post=post,
            category=self.authenticated_category,
            permission=self.read_and_edit_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'test@gmail.com')
        self.assertEqual(response_data['authenticated_permission'],'read-and-edit')
        self.assertTrue('author_permission' in response_data)
        self.assertTrue('team_permission' in response_data)
        self.assertTrue('public_permission' in response_data)
        
    def test_detail_post_with_authenticated_none_read_permission_admin_user_success(self):

        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        self.client.force_login(user=admin_user)

        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = self.user
        )
        PostsCategoryFactory(
            post=post,
            category=self.authenticated_category,
            permission=self.none_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'test@gmail.com')
        self.assertEqual(response_data['authenticated_permission'], 'none')
        self.assertTrue('author_permission' in response_data)
        self.assertTrue('team_permission' in response_data)
        self.assertTrue('public_permission' in response_data)

    def test_detail_post_whit_team_read_only_permission_admin_user_success(self):

        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        self.client.force_login(user=admin_user)

        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = self.user
        )
        PostsCategoryFactory(
            post=post,
            category=self.team_category,
            permission=self.read_only_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'test@gmail.com')
        self.assertEqual(response_data['team_permission'],'read-only')
        self.assertTrue('author_permission' in response_data)
        self.assertTrue('authenticated_permission' in response_data)
        self.assertTrue('public_permission' in response_data)


    def test_detail_post_whit_team_read_and_edit_permission_admin_user_success(self):

        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        self.client.force_login(user=admin_user)

        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = self.user
        )
        PostsCategoryFactory(
            post=post,
            category=self.team_category,
            permission=self.read_and_edit_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'test@gmail.com')
        self.assertEqual(response_data['team_permission'],'read-and-edit')
        self.assertTrue('author_permission' in response_data)
        self.assertTrue('authenticated_permission' in response_data)
        self.assertTrue('public_permission' in response_data)
        
    def test_detail_post_with_team_none_read_permission_admin_user_success(self):

        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        self.client.force_login(user=admin_user)

        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = self.user
        )
        PostsCategoryFactory(
            post=post,
            category=self.team_category,
            permission=self.none_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'test@gmail.com')
        self.assertEqual(response_data['team_permission'], 'none')
        self.assertTrue('author_permission' in response_data)
        self.assertTrue('authenticated_permission' in response_data)
        self.assertTrue('public_permission' in response_data)

    def test_detail_post_whit_author_read_only_permission_admin_user_success(self):

        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        self.client.force_login(user=admin_user)

        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = self.user
        )
        PostsCategoryFactory(
            post=post,
            category=self.author_category,
            permission=self.read_only_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'test@gmail.com')
        self.assertEqual(response_data['author_permission'],'read-only')
        self.assertTrue('team_permission' in response_data)
        self.assertTrue('authenticated_permission' in response_data)
        self.assertTrue('public_permission' in response_data)


    def test_detail_post_whit_author_read_and_edit_permission_admin_user_success(self):

        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        self.client.force_login(user=admin_user)

        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = self.user
        )
        PostsCategoryFactory(
            post=post,
            category=self.author_category,
            permission=self.read_and_edit_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'test@gmail.com')
        self.assertEqual(response_data['author_permission'],'read-and-edit')
        self.assertTrue('team_permission' in response_data)
        self.assertTrue('authenticated_permission' in response_data)
        self.assertTrue('public_permission' in response_data)
        
    def test_detail_post_with_author_none_read_permission_admin_user_success(self):

        admin_user = UserFactory(username='admin@gmail.com', is_admin=True)
        self.client.force_login(user=admin_user)

        post = PostFactory(
            title='post 1',
            content='a' * 1000,
            author = self.user
        )
        PostsCategoryFactory(
            post=post,
            category=self.author_category,
            permission=self.none_permission
        )

        endpoint = reverse('post-retrieve', kwargs={'pk': post.id})

        response = self.client.get(endpoint)

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'test@gmail.com')
        self.assertEqual(response_data['author_permission'], 'none')
        self.assertTrue('team_permission' in response_data)
        self.assertTrue('authenticated_permission' in response_data)
        self.assertTrue('public_permission' in response_data)
