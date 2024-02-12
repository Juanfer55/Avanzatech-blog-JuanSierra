# from django
from django.test import TestCase
from django.core.exceptions import ValidationError
# models
from permissions.models import PermissionLevels


class PermissionLevelModelTests(TestCase):
    """
    Test cases for PostPermissions model.
    """

    def test_create_permission_with_valid_data_success(self):

        permission_1 = PermissionLevels.objects.create(
            permission_level='read-only')
        permission_2 = PermissionLevels.objects.create(
            permission_level='read-and-edit')

        permission_count = PermissionLevels.objects.count()

        self.assertEqual(permission_1.permission_level, 'read-only')
        self.assertEqual(permission_2.permission_level, 'read-and-edit')
        self.assertEqual(permission_count, 2)

    def test_create_permission_with_no_permission_level_fail(self):

        with self.assertRaises(ValidationError):
            PermissionLevels.objects.create()

        permission_count = PermissionLevels.objects.count()

        self.assertEqual(permission_count, 0)

    def test_create_permission_with_blank_permission_level_fail(self):

        with self.assertRaises(ValidationError):
            PermissionLevels.objects.create(permission_level='')

        permission_count = PermissionLevels.objects.count()

        self.assertEqual(permission_count, 0)

    def test_create_permission_with_too_long_permission_level_fail(self):

        with self.assertRaises(ValidationError):
            PermissionLevels.objects.create(permission_level='a' * 51)

        permission_count = PermissionLevels.objects.count()

        self.assertEqual(permission_count, 0)

    def test_create_repetitive_permission_level_fail(self):

        PermissionLevels.objects.create(permission_level='read-only')

        with self.assertRaises(ValidationError):
            PermissionLevels.objects.create(permission_level='read-only')

        permission_count = PermissionLevels.objects.count()

        self.assertEqual(permission_count, 1)
