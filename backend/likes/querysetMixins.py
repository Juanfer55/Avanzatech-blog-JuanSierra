# Models
from .models import Likes
# permission querysets
from shared.permissionsQuerysets import read_permission_querySet

class LikesPermissionQuerySet:
    """
    Configures the like queryset according to the request user login status 
    and read permissions for each post.
    """

    def get_queryset(self, *args, **kwargs):
        user = self.request.user
        allowed_posts = read_permission_querySet(user)
        return Likes.objects.filter(post__in=allowed_posts)
    