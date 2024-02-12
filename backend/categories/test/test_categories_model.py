# from django
from django.test import TestCase
from django.core.exceptions import ValidationError
# models
from categories.models import Categories


class CategoriesModelTests(TestCase):
    """
    Test cases for PostPermissions model.
    """

    def test_create_category_with_valid_data_success(self):

        category = Categories.objects.create(name='public')

        category_count = Categories.objects.count()

        self.assertEqual(category.name, 'public')

        self.assertEqual(category_count, 1)

    def test_create_category_with_no_name_fail(self):

        with self.assertRaises(ValidationError):
            Categories.objects.create()

        category_count = Categories.objects.count()

        self.assertEqual(category_count, 0)

    def test_create_category_with_blank_name_fail(self):

        with self.assertRaises(ValidationError):
            Categories.objects.create(name='')

        category_count = Categories.objects.count()

        self.assertEqual(category_count, 0)

    def test_create_category_with_too_long_name_fail(self):

        with self.assertRaises(ValidationError):
            Categories.objects.create(name='a' * 51)

        category_count = Categories.objects.count()

        self.assertEqual(category_count, 0)