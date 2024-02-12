# from django filters
import django_filters

# Models
from .models import Likes

class LikesFilter(django_filters.FilterSet):
    """
    Filters for Likes model to allow filtering by post id and user id
    """
    post = django_filters.CharFilter(field_name='post__id')
    user = django_filters.CharFilter(field_name='user__id')

    class Meta:
        model = Likes
        fields = ['post', 'user']
