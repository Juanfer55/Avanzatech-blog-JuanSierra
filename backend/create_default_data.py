# models
from teams.models import Teams
from permissions.models import PermissionLevels
from categories.models import Categories
from user.models import CustomUser
from posts.models import Posts
from post_category.models import PostCategory
from comments.models import Comments
from likes.models import Likes
# info for filling the posts
from post_info import text, comment

def create_default_data_base_info():
    """
    This function creates the default team, permission levels and categories for the application.
    """
    # create a default team
    Teams.objects.create(name='Default')

    # create the permission levels
    PermissionLevels.objects.create(permission_level='none')
    PermissionLevels.objects.create(permission_level='read-only')
    PermissionLevels.objects.create(permission_level='read-and-edit')

    # create the categories
    Categories.objects.create(name='public')
    Categories.objects.create(name='authenticated')
    Categories.objects.create(name='team')
    Categories.objects.create(name='author')

def create_teams():
    """
    This function creates 3 teams: Bravo, Alpha and Charlie.
    """
    # Create the teams
    Teams.objects.create(name='Bravo')
    Teams.objects.create(name='Alpha')
    Teams.objects.create(name='Charlie')
    
def create_users():
    """
    This function creates 10 users for each team, 5 admin users and a super user.
    """
    # Create 10 users for the team Bravo
    for i in range(1, 11):
        CustomUser.objects.create_user(username=f'bravo{i}@gmail.com', password='test123456', team_id=2)
    # Create 10 users for the team Alpha
    for i in range(1, 11):
        CustomUser.objects.create_user(username=f'alpha{i}@gmail.com', password='test123456', team_id=3)
    # create 10 users for the Charlie team
    for i in range(1, 11):
        CustomUser.objects.create_user(username=f'charlie{i}@gmail.com', password='test123456', team_id=4)
    # Create 5 admin users
    for i in range(1, 6):
        CustomUser.objects.create_user(username=f'admin{i}@gmail.com', password='test123456', is_admin=True)
    # create superuser
    CustomUser.objects.create_superuser(username='super@gmail.com', password='test123456')

def create_default_post():
    """
    This function creates posts with default categories and permissions for each user.

    All the posts will be created with read and edit permission for all the categories.
    """
    # post for each bravo team member
    for i in range(1, 11):
        post = Posts.objects.create(title=f'Default post {i}', content=text, author_id=i)
        for j in range(1, 5):
            PostCategory.objects.create(post=post, category_id=j, permission_id=3)
        for k in range(1, 21):
            Likes.objects.create(post=post, user_id=k)
        Comments.objects.create(post=post, user_id=i, content=comment)
    # post for each alpha team member
    for i in range(11, 21):
        post = Posts.objects.create(title=f'Default post {i}', content=text, author_id=i)
        for j in range(1, 5):
            PostCategory.objects.create(post=post, category_id=j, permission_id=3)
        for k in range(1, 21):
            Likes.objects.create(post=post, user_id=k)
        Comments.objects.create(post=post, user_id=i, content=comment)
        # post for each charlie team member
    for i in range(21, 31):
        post = Posts.objects.create(title=f'Default post {i}', content=text, author_id=i)
        for j in range(1, 5):
            PostCategory.objects.create(post=post, category_id=j, permission_id=3)
        for k in range(1, 21):
            Likes.objects.create(post=post, user_id=k)
        Comments.objects.create(post=post, user_id=i, content=comment)

def create_default_data():
    """
    This function creates all the default data for the application.
    """
    create_default_data_base_info()
    create_teams()
    create_users()
    create_default_post()

create_default_data()