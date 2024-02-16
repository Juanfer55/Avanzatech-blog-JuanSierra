# From django
from django.urls import reverse
# From rest framework
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.test import APITestCase
# testing utilities
from testing_utilities.factories import UserFactory, PostFactory, TeamsFactory, PostsCategoryFactory
from testing_utilities.utils import set_up_test_environment
# json
import json


class EditPostsEndpoint(APITestCase):
    """
    Tests for editing posts via the API.

    This class contains test cases for different scenarios when editing 
    a post via the API endpoint. The tests validate the response status codes, 
    edited fields, and validation of input data when patching a post.
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

    def test_update_post_with_public_read_and_edit_permission_unauthenticated_user_success(self):

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

        data = {
            'title': 'Test title',
            'content': 'b' * 1000,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')
        
        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'Test title')
        self.assertEqual(response_data['content'], 'b' * 1000)
        self.assertEqual(response_data['author']['username'], 'author@gmail.com')

    def test_update_post_with_public_read_only_permission_unauthenticated_user_fail(self):

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

        data = {
            'title': 'Test title',
            'content': 'b' * 1000,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_post_with_public_none_read_or_edit_permission_unauthenticated_user_fail(self):

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

        data = {
            'title': 'Test title',
            'content': 'b' * 1000,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')
        

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_post_with_authenticated_read_and_edit_permission_authenticated_user_success(self):

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

        data = {
            'title': 'Test title',
            'content': 'b' * 1000,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'Test title')
        self.assertEqual(response_data['content'], 'b' * 1000)
        self.assertEqual(response_data['author']['username'], 'author@gmail.com')

    def test_update_post_with_authenticated_read_only_permission_authenticated_user_fail(self):

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

        data = {
            'title': 'Test title',
            'content': 'b' * 1000,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_post_with_authenticated_none_read_or_edit_permission_authenticated_user_fail(self):

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

        data = {
            'title': 'Test title',
            'content': 'b' * 1000,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')
        

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_post_with_team_read_and_edit_permission_authenticated_user_same_team_success(self):

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

        data = {
            'title': 'Test title',
            'content': 'b' * 1000,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')
        
        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'Test title')
        self.assertEqual(response_data['content'], 'b' * 1000)
        self.assertEqual(response_data['author']['username'], 'author@gmail.com')

    def test_update_post_with_team_read_and_edit_permission_authenticated_user_different_team_fail(self):

        author = UserFactory(username='author@gmail.com', team=TeamsFactory(name='team 1'))
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

        data = {
            'title': 'Test title',
            'content': 'b' * 1000,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_post_with_team_read_only_permission_authenticated_user_same_team_fail(self):

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

        data = {
            'title': 'Test title',
            'content': 'b' * 1000,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_post_with_team_none_read_or_edit_permission_authenticated_user_same_team_fail(self):

        author = UserFactory(username='author@gmail.com', team=self.test_team)
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

        data = {
            'title': 'Test title',
            'content': 'b' * 1000,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')
        

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    def test_update_post_with_author_read_and_edit_permission_authenticated_user_same_author_success(self):

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

        data = {
            'title': 'Test title',
            'content': 'b' * 1000,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')
        
        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'Test title')
        self.assertEqual(response_data['content'], 'b' * 1000)
        self.assertEqual(response_data['author']['username'], 'test@gmail.com')

    def test_update_post_with_author_read_only_permission_authenticated_user_same_author_fail(self):

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

        data = {
            'title': 'Test title',
            'content': 'b' * 1000,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')
        

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_post_with_author_none_read_or_edit_permission_authenticated_user_same_author_fail(self):

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

        data = {
            'title': 'Test title',
            'content': 'b' * 1000,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')
        

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_post_whit_valid_data_success(self):

        self.client.logout()
        author = UserFactory(username='author@gmail.com')
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.read_and_edit_permission
        )

        data = {
            'title': 'post 1',
            'content': 'a' * 1000,
            'public_permission': 2,
            'authenticated_permission': 1,
            'team_permission': 3,
            'author_permission': 2,

        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(endpoint, json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data['title'], 'post 1')
        self.assertEqual(response_data['content'], 'a' * 1000)
        self.assertEqual(response_data['author']['username'], 'author@gmail.com')

    def test_update_post_with_no_title_fail(self):

        self.client.logout()
        author = UserFactory(username='author@gmail.com')
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.read_and_edit_permission
        )

        data = {
            'content': 'a' * 1000,
            'public_permission': 2,
            'authenticated_permission': 1,
            'team_permission': 3,
            'author_permission': 2,
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(endpoint, json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['title'][0], 'This field is required.')

    def test_update_post_with_blank_title_fail(self):
        
        self.client.logout()
        author = UserFactory(username='author@gmail.com')
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.read_and_edit_permission
        )

        data = {
            'title': '',
            'content': 'a' * 1000,
            'public_permission': 2,
            'authenticated_permission': 1,
            'team_permission': 3,
            'author_permission': 2,
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(endpoint, json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['title'][0], 'This field may not be blank.')

    def test_update_post_long_title_fail(self):

        self.client.logout()
        author = UserFactory(username='author@gmail.com')
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.read_and_edit_permission
        )

        data = {
            'title': 'a' * 51,
            'content': 'a' * 1000,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3 
        }
        
        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(endpoint, data=json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['title'][0], 'Ensure this field has no more than 50 characters.')

    def test_update_post_blank_content_fail(self):

        self.client.logout()
        author = UserFactory(username='author@gmail.com')
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.read_and_edit_permission
        )

        data = {
            'title': 'Test title',
            'content': '',
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3 
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['content']
                         [0], 'This field may not be blank.')

    def test_update_post_no_content_fail(self):

        self.client.logout()
        author = UserFactory(username='author@gmail.com')
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.read_and_edit_permission
        )

        data = {
            'title': 'Test title',
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3 
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response_data['content']
                         [0], 'This field is required.')

    def test_update_post_long_content_fail(self):

        self.client.logout()
        author = UserFactory(username='author@gmail.com')
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.read_and_edit_permission
        )

        data = {
            'title': 'Test title',
            'content': 'a' * 10001,
            'public_permission': 1,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3 
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})
        
        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['content'][0], 'Ensure this field has no more than 10000 characters.')

    def test_update_post_no_public_permission_fail(self):

        self.client.logout()
        author = UserFactory(username='author@gmail.com')
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.read_and_edit_permission
        )

        data = {
            'title': 'Test title',
            'content': 'a' * 1001,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3 
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})
        
        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['public_permission'][0], 'This field is required.')
    
    def test_update_post_with_invalid_public_permission_fail(self):

        self.client.logout()
        author = UserFactory(username='author@gmail.com')
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.read_and_edit_permission
        )

        data = {
            'title': 'Test title',
            'content': 'a' * 1001,
            'public_permission': 4,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 3 
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})
        
        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['public_permission'][0], 'Invalid pk "4" - object does not exist.')
        
    def test_update_post_no_authenticated_permission_fail(self):

        self.client.logout()
        author = UserFactory(username='author@gmail.com')
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.read_and_edit_permission
        )

        data = {
            'title': 'Test title',
            'content': 'a' * 1001,
            'public_permission': 2,
            'team_permission': 3,
            'author_permission': 3 
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})
        
        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')

        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['authenticated_permission'][0], 'This field is required.')
        
    def test_update_post_with_invalid_authenticated_permission_fail(self):

        self.client.logout()
        author = UserFactory(username='author@gmail.com')
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.read_and_edit_permission
        )

        data = {
            'title': 'Test title',
            'content': 'a' * 1001,
            'public_permission': 2,
            'authenticated_permission': 4,
            'team_permission': 3,
            'author_permission': 3
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')
        
        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['authenticated_permission'][0], 'Invalid pk "4" - object does not exist.')
        
    def test_update_post_no_team_permission_fail(self):

        self.client.logout()
        author = UserFactory(username='author@gmail.com')
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.read_and_edit_permission
        )

        data = {
            'title': 'Test title',
            'content': 'a' * 1001,
            'public_permission': 2,
            'authenticated_permission': 2,
            'author_permission': 3
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')
        
        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['team_permission'][0], 'This field is required.')
        
    def test_update_post_with_invalid_team_permission_fail(self):

        self.client.logout()
        author = UserFactory(username='author@gmail.com')
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.read_and_edit_permission
        )

        data = {
            'title': 'Test title',
            'content': 'a' * 1001,
            'public_permission': 2,
            'authenticated_permission': 2,
            'team_permission': 4,
            'author_permission': 3
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')
        
        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['team_permission'][0], 'Invalid pk "4" - object does not exist.')
        
    def test_update_post_no_author_permission_fail(self):

        self.client.logout()
        author = UserFactory(username='author@gmail.com')
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.read_and_edit_permission
        )

        data = {
            'title': 'Test title',
            'content': 'a' * 1001,
            'public_permission': 2,
            'authenticated_permission': 2,
            'team_permission': 3
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')
        
        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['author_permission'][0], 'This field is required.')
        
    def test_update_post_with_invalid_author_permission_fail(self):

        self.client.logout()        
        author = UserFactory(username='author@gmail.com')
        post = PostFactory(author=author)
        PostsCategoryFactory(
            post=post,
            category=self.public_category,
            permission=self.read_and_edit_permission
        )

        data = {
            'title': 'Test title',
            'content': 'a' * 1001,
            'public_permission': 2,
            'authenticated_permission': 2,
            'team_permission': 3,
            'author_permission': 4
        }

        endpoint = reverse('blog-edit-destroy', kwargs={'pk': post.id})

        response = self.client.put(
            endpoint, data=json.dumps(data), content_type='application/json')
        
        response_data = response.json()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response_data['author_permission'][0], 'Invalid pk "4" - object does not exist.')
