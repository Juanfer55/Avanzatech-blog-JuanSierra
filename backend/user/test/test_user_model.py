# from django
from django.test import TestCase
from testing_utilities.factories import UserFactory, TeamsFactory
from django.core.exceptions import ValidationError
# models
from user.models import CustomUser


class CustomUserTests(TestCase):
    """
    Test cases for CustomUser model
    """

    def setUp(self):
        """
        Set up default team for tests.
        """
        self.team = TeamsFactory(name='default')

    def test_create_user_valid_data_success(self):

        user = CustomUser.objects.create_user(
            username='test@gmail.com', password='Test123456')

        user_search = CustomUser.objects.get(username=user.username)

        users_count = CustomUser.objects.count()

        self.assertEqual(user_search.username, user.username)
        self.assertEqual(user_search.team, user.team)
        self.assertEqual(users_count, 1)

    def test_defaults_are_set_correctly(self):

        user = CustomUser.objects.create_user(
            username='test@gmail.com', password='Test123456')

        self.assertEqual(user.username, 'test@gmail.com')
        self.assertEqual(user.team.name, 'default')
        self.assertEqual(user.is_superuser, False)
        self.assertEqual(user.is_staff, False)
        self.assertEqual(user.is_active, True)
        self.assertEqual(user.is_admin, False)

    def test_create_user_no_email_fail(self):

        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(username='', password='test123456')

        self.assertEqual(CustomUser.objects.count(), 0)

    def test_create_user_invalid_email_fail(self):

        with self.assertRaises(ValidationError):
            CustomUser.objects.create_user(
                username='test', password='test123456')

        self.assertEqual(CustomUser.objects.count(), 0)

    def test_crate_user_no_password_fail(self):

        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(
                username='user@gmail.com', password='')

        self.assertEqual(CustomUser.objects.count(), 0)

    def test_user_create_numeric_password_fail(self):

        with self.assertRaises(ValidationError):
            user = CustomUser.objects.create_user(
                username='user@gmail.com', password='12345678')

        self.assertEqual(CustomUser.objects.count(), 0)

    def test_create_user_short_password_fail(self):

        with self.assertRaises(ValidationError):
            user = CustomUser.objects.create_superuser(
                username='super@gmail.com', password='Short8')
            user.save()

        self.assertEqual(CustomUser.objects.count(), 0)

    def test_create_superuser_valid_data_success(self):

        user = UserFactory(is_superuser=True, is_admin=True, is_staff=True)

        user_search = CustomUser.objects.get(username=user.username)

        users_count = CustomUser.objects.count()

        self.assertEqual(user_search.username, user.username)
        self.assertEqual(user_search.team, user.team)
        self.assertEqual(user_search.is_superuser, user.is_superuser)
        self.assertEqual(user_search.is_admin, user.is_admin)
        self.assertEqual(user_search.is_staff, user.is_staff)
        self.assertEqual(users_count, 1)

    def test_create_superuser_no_email_fail(self):

        with self.assertRaises(ValueError):
            CustomUser.objects.create_superuser(
                username='', password='Test123456')

        self.assertEqual(CustomUser.objects.count(), 0)

    def test_create_superuser_invalid_email_fail(self):

        with self.assertRaises(ValidationError):
            CustomUser.objects.create_superuser(
                username='test', password='Test123456')

        self.assertEqual(CustomUser.objects.count(), 0)

    def test_create_superuser_no_password_fail(self):

        with self.assertRaises(ValueError):
            CustomUser.objects.create_superuser(
                username='super@gmail.com', password='')

        self.assertEqual(CustomUser.objects.count(), 0)

    def test_create_superuser_numeric_password_fail(self):

        with self.assertRaises(ValidationError):
            CustomUser.objects.create_superuser(
                username='super@gmail.com', password='12345678')

        self.assertEqual(CustomUser.objects.count(), 0)

    def test_create_superuser_short_password_fail(self):

        with self.assertRaises(ValidationError):
            CustomUser.objects.create_superuser(
                username='super@gmail.com', password='Short8')

        self.assertEqual(CustomUser.objects.count(), 0)

    def test_create_user_with_invalid_team_fail(self):

        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(
                username='user@gmail.com', password='Test123456', team=123)

        self.assertEqual(CustomUser.objects.count(), 0)

    def test_str_method_success(self):

        user = CustomUser.objects.create_user(
            username='test@gmail.com', password='Test123456')

        self.assertEqual(str(user), user.username)
