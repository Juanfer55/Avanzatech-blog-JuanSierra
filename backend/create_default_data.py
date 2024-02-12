# models
from teams.models import Teams
from permissions.models import PermissionLevels
from categories.models import Categories
from user.models import CustomUser
from posts.models import Posts
from postCategory.models import PostCategory

# create a default team
Teams.objects.create(name='default')

# create the permission levels
none = PermissionLevels.objects.create(permission_level='none')
read_only = PermissionLevels.objects.create(permission_level='read-only')
read_and_edit = PermissionLevels.objects.create(permission_level='read-and-edit')

# create the categories
public = Categories.objects.create(name='public')
authenticated = Categories.objects.create(name='authenticated')
team = Categories.objects.create(name='team')
author = Categories.objects.create(name='author')

# create superuser
CustomUser.objects.create_superuser(username='super@gmail.com', password='test123456')

#create user
user = CustomUser.objects.create_user(username='user1@gmail.com', password='test123456')

#create default post
post = Posts.objects.create(title='default post', content='default post content', author=user)

# permission for the posts
PostCategory.objects.create(post=post, category=public, permission=read_and_edit)
PostCategory.objects.create(post=post, category=authenticated, permission=read_and_edit)
PostCategory.objects.create(post=post, category=team, permission=read_and_edit)
PostCategory.objects.create(post=post, category=author, permission=read_and_edit)

# to run on the django shell is :
# python manage.py shell < create_default_data.py