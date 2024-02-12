# from django
from django.db.models import Q
# models
from posts.models import Posts
# Constants
from shared.constants import Category, Permission


def read_permission_querySet(user):
    """
    Configures the queryset for getting all the posts 
    that the request user has read permission for.
    """
    if user.is_authenticated:
        if user.is_admin:
            return Posts.objects.all()

        # Get posts with authenticated read permission where requester and author differ, and their teams are distinct
        authenticated_publications = Q(postcategory__category=Category.AUTHENTICATED) & Q(
            postcategory__permission__gte=Permission.READ_ONLY) & ~Q(author=user) & ~Q(author__team=user.team)
        
        # Get posts with team read permission where requester and author differ, but their teams are the same
        team_publications = Q(postcategory__category=Category.TEAM) & Q(
            postcategory__permission__gte=Permission.READ_ONLY) & ~Q(author=user) & Q(author__team=user.team)
        
        # Get posts with author read permission where requester and author are the same
        author_publications = Q(postcategory__category=Category.AUTHOR) & Q(
            postcategory__permission__gte=Permission.READ_ONLY) & Q(author=user)

        return Posts.objects.filter(authenticated_publications | team_publications | author_publications)

    # Get posts with public read permission
    public_publications = Q(postcategory__category=Category.PUBLIC) & Q(
        postcategory__permission__gte=Permission.READ_ONLY)

    return Posts.objects.filter(public_publications)

# --- THIS AND EXAMPLE OF THE QUERY PERFORM ---
# SELECT *
# FROM posts
# JOIN post_category ON post.id = post_category.post
# WHERE 
# (post_category.category = authenticated and post_category.permission >= read only and post.author != user and post.author.team!= user.team)
# (post_category.category = team and post_category.permission >= read only and post.author != user and post.author.team = user.team)
# (post_category.category = author and post_category.permission >= read only and post.author = user)


def edit_permission_queryset(user):
    """
    Configures the queryset for getting all the posts
    that the request user has edit permission for.
    """

    if user.is_authenticated:
        if user.is_admin:
            return Posts.objects.all()

        # Get posts with authenticated edit permission where requester and author differ, and their teams are distinct
        authenticated_publications = Q(postcategory__category=Category.AUTHENTICATED) & Q(
            postcategory__permission__gte=Permission.READ_AND_EDIT) & ~Q(author=user) & ~Q(author__team=user.team)
        
        # Get posts with team edit permission where requester and author differ, but their teams are the same
        team_publications = Q(postcategory__category=Category.TEAM) & Q(
            postcategory__permission__gte=Permission.READ_AND_EDIT) & ~Q(author=user) & Q(author__team=user.team)
        
        # Get posts with author edit permission where requester and author are the same
        author_publications = Q(postcategory__category=Category.AUTHOR) & Q(
            postcategory__permission__gte=Permission.READ_AND_EDIT) & Q(author=user)

        return Posts.objects.filter(authenticated_publications | team_publications | author_publications)

    # Get posts with public edit permission
    public_publications = Q(postcategory__category=Category.PUBLIC) & Q(
        postcategory__permission__gte=Permission.READ_AND_EDIT)

    return Posts.objects.filter(public_publications)

# --- THIS AND EXAMPLE OF THE QUERY PERFORM ---
# SELECT *
# FROM posts
# JOIN post_category ON post.id = post_category.post
# WHERE 
# (post_category.category = authenticated and post_category.permission = read_and_edit and post.author != user and post.author.team!= user.team)
# (post_category.category = team and post_category.permission = read_and_edit and post.author != user and post.author.team = user.team)
# (post_category.category = author and post_category.permission = read_and_edit and post.author = user)