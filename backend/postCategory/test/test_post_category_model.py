# from django
from django.test import TestCase
# models
from postCategory.models import PostCategory
# testing - utils
from testing_utilities.factories import UserFactory, PostFactory
from testing_utilities.utils import set_up_test_environment


class PostCategoryModelTests(TestCase):
    """
    Tests the Posts model.
    """
    def setUp(self):
        """
        Sets up the test environment.
        """
        set_up_test_environment(self)

    def test_create_post_category_with_valid_data_fail(self):

        post = PostFactory()
        category = self.public_category
        permission = self.read_only_permission

        PostCategory.objects.create(
            post=post,
            category=category,
            permission=permission,
        )

        post_category_count = PostCategory.objects.count()

        self.assertEqual(post_category_count, 1)
        
    def test_create_post_category_with_invalid_post_fail(self):

        category = self.public_category
        permission = self.read_only_permission

        with self.assertRaises(ValueError):
            PostCategory.objects.create(
                post=1,
                category=category,
                permission=permission,
            )

        post_category_count = PostCategory.objects.count()

        self.assertEqual(post_category_count, 0)
    
    def test_create_post_category_with_invalid_category_fail(self):

        post = PostFactory()
        permission = self.read_only_permission

        with self.assertRaises(ValueError):
            PostCategory.objects.create(
                post=post,
                category=10,
                permission=permission,
            )
        
        post_category_count = PostCategory.objects.count()

        self.assertEqual(post_category_count, 0)

    def test_create_post_category_with_invalid_permission_fail(self):

        post = PostFactory()
        category = self.public_category

        with self.assertRaises(ValueError):
            PostCategory.objects.create(
                post=post,
                category=category,
                permission=10,
            )
        
        post_category_count = PostCategory.objects.count()

        self.assertEqual(post_category_count, 0)
