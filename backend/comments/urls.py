# from django
from django.urls import path
# views
from .views import CommentListFilterCreateView, CommentDestroyView

urlpatterns = [
    path('',
         CommentListFilterCreateView.as_view(),
         name='comment-list-filter-create'),

    path('<int:pk>/',
         CommentDestroyView.as_view(),
         name='comment-delete'),
]
