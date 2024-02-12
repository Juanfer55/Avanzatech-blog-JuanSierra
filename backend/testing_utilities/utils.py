"""utilities for configuring the test environment"""
# factories
from testing_utilities.factories import PermissionsFactory, TeamsFactory, CategoriesFactory


def generate_categories(self):
    """set up default categories"""
    self.public_category = CategoriesFactory(name='public')
    self.authenticated_category = CategoriesFactory(name='authenticated')
    self.team_category = CategoriesFactory(name='team')
    self.author_category = CategoriesFactory(name='author')
    return


def generate_permissions(self):
    """set up default permissions"""
    self.none_permission = PermissionsFactory(permission_level='none')
    self.read_only_permission = PermissionsFactory(permission_level='read-only')
    self.read_and_edit_permission = PermissionsFactory(permission_level='read-and-edit')
    return


def generate_teams(self):
    """set up initial team"""
    self.default_team = TeamsFactory(name='default')
    return


def set_up_test_environment (self):
    """
    set up test environment.
    Generate the default categories, permissions, and teams.
    """
    generate_categories(self)
    generate_permissions(self)
    generate_teams(self)
    return