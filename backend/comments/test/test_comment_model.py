#from django
from django.test import TestCase
from django.core.exceptions import ValidationError
# models
from ..models import Comments
# testing utilities
from testing_utilities.factories import UserFactory, PostFactory, TeamsFactory

class CommentModelTests(TestCase):
    """
    Tests for Like model.
    """
    def setUp(self):
        """
        Sets up user and post instances for the tests.
        """
        self.test_team = TeamsFactory(name='Test-Team')
        self.user = UserFactory(username='test@gmail.com', team=self.test_team)

    def test_create_comment_with_valid_data_success(self):

        post = PostFactory(author=self.user, title='post', content='content')
        comment = Comments.objects.create(user=self.user, post=post, content='content')

        comments_count = Comments.objects.count()

        self.assertEqual(comment.user, self.user)
        self.assertEqual(comment.post, post)
        self.assertEqual(comment.content, 'content')
        self.assertTrue(comment.created_at)
        self.assertTrue(comment.modified_at)
        self.assertTrue(comment.id)
        self.assertEqual(comments_count, 1)

    def test_create_comment_with_blank_content_fails(self):

        with self.assertRaises(ValidationError):
            Comments.objects.create(user=self.user, post=PostFactory(author=self.user), content='')
        
        comments_count = Comments.objects.count()

        self.assertEqual(comments_count, 0)

    def test_create_comment_with_long_content_fail(self):

        with self.assertRaises(ValidationError):
            Comments.objects.create(user=self.user, post=PostFactory(author=self.user), content='a'* 1001)

        comments_count = Comments.objects.count()

        self.assertEqual(comments_count, 0)

    def test_create_comment_with_no_user_fail(self):

        with self.assertRaises(ValidationError):
            Comments.objects.create(post=PostFactory(author=self.user), content='content')

        comments_count = Comments.objects.count()

        self.assertEqual(comments_count, 0)

    def test_create_comment_with_no_post_fail(self):

        with self.assertRaises(ValidationError):
            Comments.objects.create(user=self.user, content='content')

        comments_count = Comments.objects.count()

        self.assertEqual(comments_count, 0)

    def test_comment_str_method_succes(self):

        post = PostFactory(author=self.user, title='post', content='content')
        comment = Comments.objects.create(user=self.user, post=post, content='content')

        self.assertEqual(str(comment), 'test@gmail.com comment on post')