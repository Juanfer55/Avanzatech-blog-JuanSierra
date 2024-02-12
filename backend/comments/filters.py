# from django filters
import django_filters

# Models
from .models import Comments

class CommentsFilter(django_filters.FilterSet):
    """
    Filters for Comments model to allow filtering by post id and user id
    """
    post = django_filters.CharFilter(field_name='post__id')
    user = django_filters.CharFilter(field_name='user__id')

    class Meta:
        model = Comments
        fields = ['post', 'user']
