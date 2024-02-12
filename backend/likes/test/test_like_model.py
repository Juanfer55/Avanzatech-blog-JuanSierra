#from django
from django.test import TestCase
from django.core.exceptions import ValidationError
# models
from ..models import Likes
# testing utilities
from testing_utilities.factories import UserFactory, PostFactory, TeamsFactory

class LikeModelTests(TestCase):
    """
    Tests for Like model.
    """
    def setUp(self):
        """
        Sets up user and post instances for the tests.
        """
        self.test_team = TeamsFactory(name='Test-Team')
        self.user = UserFactory(username='test@gmail.com', team=self.test_team)

    def test_create_like_with_valid_data_success(self):

        post = PostFactory(author=self.user, title='post', content='content')
        like = Likes.objects.create(user=self.user, post=post)

        likes_count = Likes.objects.count()

        self.assertEqual(like.user, self.user)
        self.assertEqual(like.post, post)
        self.assertTrue(like.created_at)
        self.assertTrue(like.modified_at)
        self.assertTrue(like.id)
        self.assertEqual(likes_count, 1)

    def test_create_like_with_invalid_data_fails(self):

        with self.assertRaises(ValidationError):
            Likes.objects.create()

        likes_count = Likes.objects.count()

        self.assertEqual(likes_count, 0)

    def test_like_unique_together_constraint(self):

        post = PostFactory(author=self.user, title='post', content='content')
        Likes.objects.create(user=self.user, post=post)

        with self.assertRaises(ValidationError):
            Likes.objects.create(user=self.user, post=post)

        likes_count = Likes.objects.count()

        self.assertEqual(likes_count, 1)
        
    def test_like_str_method(self):

        post = PostFactory(author=self.user, title='post', content='content')
        like = Likes.objects.create(user=self.user, post=post)

        self.assertEqual(str(like), f'{self.user.username} likes {post.title}')