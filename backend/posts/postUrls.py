# from django
from django.urls import path
# views
from .views import PostListCreateView, PostRetrieveView

urlpatterns = [
    path('', PostListCreateView.as_view(),
         name='post-list-create'),
    path('<int:pk>/', PostRetrieveView.as_view(),
         name='post-retrieve'),
]
