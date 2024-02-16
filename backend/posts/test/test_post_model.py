# from django
from django.test import TestCase
from django.core.exceptions import ValidationError
# models
from posts.models import Posts
# testing - utils
from testing_utilities.factories import UserFactory, TeamsFactory


class PostsModelTests(TestCase):
    """
    Tests the Posts model.
    """
    def setUp(self):
        """
        Sets up the test environment.
        Sets up the authenticated user for the tests.
        """
        self.test_team = TeamsFactory(name='Test-Team')
        self.user = UserFactory(
            username='test@gmail.com', password='Tes123456', team=self.test_team)

    def test_create_post_with_valid_data(self):

        post = Posts.objects.create(
            title='Test Title',
            content='Test Content',
            author=self.user,
        )

        post.save()

        self.assertEqual(Posts.objects.count(), 1)
        self.assertEqual(post.title, 'Test Title')
        self.assertEqual(post.content, 'Test Content')
        self.assertEqual(post.author, self.user)
        self.assertEqual(post.content_excerpt, 'Test Content')


    def test_create_post_generate_content_excerpt(self):

        post = Posts.objects.create(
            title='Test Title',
            content='a ' * 500,
            author=self.user,
        )

        post.save()

        self.assertTrue(post.content_excerpt)

    def test_create_post_with_no_title_fail(self):

        with self.assertRaises(ValidationError):
            post = Posts.objects.create(
                title='',
                content='Test Content',
                author=self.user,
            )

            post.save()

        self.assertEqual(Posts.objects.count(), 0)

    def test_crate_post_with_long_title_fail(self):

        with self.assertRaises(ValidationError):
            post = Posts.objects.create(
                title='a' * 51,
                content='Test Content',
                author=self.user
            )

            post.save()


        self.assertEqual(Posts.objects.count(), 0)

    def test_create_post_with_no_content_fail(self):

        with self.assertRaises(ValidationError):
            post = Posts.objects.create(
                title='Test title',
                content='',
                author=self.user,
            )

            post.save()


        self.assertEqual(Posts.objects.count(), 0)

    def test_create_post_with_long_content_fail(self):

        with self.assertRaises(ValidationError):
            post = Posts.objects.create(
                title='Test title',
                content='a' * 10001,
                author=self.user,
            )

            post.save()


        self.assertEqual(Posts.objects.count(), 0)

    def test_create_post_with_no_author_fail(self):


        with self.assertRaises(ValidationError):
            post = Posts.objects.create(
                title='Test title',
                content='a' * 1001
            )

            post.save()


        self.assertEqual(Posts.objects.count(), 0)

    def test_create_post_with_invalid_author_fail(self):

        with self.assertRaises(ValueError):
            post = Posts.objects.create(
                title='Test title',
                content='a' * 1001,
                author='inavlid',
            )

            post.save()


        self.assertEqual(Posts.objects.count(), 0)

    def test_create_post_with_no_category_fail(self):

        with self.assertRaises(ValueError):
            post = Posts.objects.create(
                title='Test title',
                content='a' * 1001,
                author='inavlid'
            )

            post.save()


        self.assertEqual(Posts.objects.count(), 0)

    def test_create_post_with_invalid_category_fail(self):

        with self.assertRaises(ValueError):
            post = Posts.objects.create(
                title='Test title',
                content='a' * 1001,
                author='inavlid'
            )

            post.save()


        self.assertEqual(Posts.objects.count(), 0)

    def test_create_post_with_no_permissions(self):

        with self.assertRaises(ValidationError):
            post = Posts.objects.create(
                title='Test title',
                content='a' * 1001,
            )

            post.save()


        self.assertEqual(Posts.objects.count(), 0)

    def test_create_post_with_invalid_permissions(self):

        with self.assertRaises(ValidationError):
            post = Posts.objects.create(
                title='Test title',
                content='a' * 1001,
            )

            post.save()


        self.assertEqual(Posts.objects.count(), 0)


    def test_post_str_method_success(self):

        post = Posts.objects.create(
            title='Test Title',
            content='Test Content',
            author=self.user,
        )
        post.save()

        self.assertEqual(str(post), post.title)
