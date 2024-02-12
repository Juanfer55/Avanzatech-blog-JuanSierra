# from django
from django.test import TestCase
from django.core.exceptions import ValidationError
# models
from teams.models import Teams


class PostsModelTests(TestCase):
    """
    Tests the Posts model.
    """
    
    def test_create_team_with_valid_data_success(self):

        team = Teams.objects.create(
            name='Test Team',
        )

        team.save()

        teams_count = Teams.objects.count()

        self.assertEqual(teams_count, 1)
        self.assertEqual(team.name, 'Test Team')

    def test_create_team_with_blank_name_failure(self):

        with self.assertRaises(ValidationError):
            team = Teams.objects.create(
                name='',
            )

        teams_count = Teams.objects.count()

        self.assertEqual(teams_count, 0)

    def test_create_team_with_too_long_name_failure(self):

        with self.assertRaises(ValidationError):
            team = Teams.objects.create(
                name='a' * 21,
            )

        teams_count = Teams.objects.count()

        self.assertEqual(teams_count, 0)
