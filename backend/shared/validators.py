# from django
from rest_framework.exceptions import NotFound
# models
from post_category.models import PostCategory
# constants
from shared.constants import Category, Permission

def validate_user_read_permissions(user, post):
    """
    Validates if the user has read permissions for the post.
    """

    if user.is_admin:
        return True
    
    # I get all the permission for the post
    post_read_permission = PostCategory.objects.select_related('category', 'permission', 'post').filter(
        post=post,
        permission__id__gte=Permission.READ_ONLY
    )

    # I iterate each reault and validate if the user has the read permission
    for post_permission in post_read_permission:

        if post_permission.category_id == Category.AUTHENTICATED:
            if post_permission.post.author != user and post_permission.post.author.team != user.team:
                return True
        if post_permission.category_id == Category.TEAM:
            if post_permission.post.author != user and post_permission.post.author.team == user.team:
                return True
        elif post_permission.category_id == Category.AUTHOR:
            if post_permission.post.author == user:
                return True
            
    raise NotFound
