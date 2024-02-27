# from factory boy
from factory.django import DjangoModelFactory
from factory import Faker, SubFactory
# from django
from django.contrib.auth.hashers import make_password
# models
from posts.models import Posts
from user.models import CustomUser
from likes.models import Likes
from comments.models import Comments
from teams.models import Teams
from permissions.models import PermissionLevels
from categories.models import Categories
from post_category.models import PostCategory

class CategoriesFactory(DjangoModelFactory):
    """Factory for Categories model."""
    class Meta:
        model = Categories

    name = 'public'


class PermissionsFactory(DjangoModelFactory):
    """Factory for PermissionLevels model."""
    class Meta:
        model = PermissionLevels

    permission_level = 'read-only'


class TeamsFactory(DjangoModelFactory):
    """Factory for Teams model."""
    class Meta:
        model = Teams

    name = Faker('word')


class UserFactory(DjangoModelFactory):
    """Factory for CustomUser model."""
    class Meta:
        model = CustomUser

    username = Faker('email')
    password = make_password('defaultpassword')
    team = SubFactory(TeamsFactory)
    is_admin = False
    is_superuser = False
    is_staff = False


class PostFactory(DjangoModelFactory):
    """Factory for Posts model."""
    class Meta:
        model = Posts

    title = Faker('name')
    content = Faker('text')
    author = SubFactory(UserFactory)


class LikesFactory(DjangoModelFactory):
    """Factory for Likes model."""
    class Meta:
        model = Likes

    post = SubFactory(PostFactory)
    user = SubFactory(UserFactory)


class CommentsFactory(DjangoModelFactory):
    """Factory for Comments model."""
    class Meta:
        model = Comments

    post = SubFactory(PostFactory)
    user = SubFactory(UserFactory)
    content = Faker('text')

class PostsCategoryFactory(DjangoModelFactory):
    """Factory for Posts-Category"""
    class Meta:
        model = PostCategory
        
    category = SubFactory(CategoriesFactory)
    post = SubFactory(PostFactory)
    permission = SubFactory(PermissionsFactory)
