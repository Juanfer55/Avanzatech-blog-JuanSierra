# from django
from django.urls import path
# views
from .views import PostUpdateDeleteView

urlpatterns = [
    path('<int:pk>/', PostUpdateDeleteView.as_view(),
         name='blog-edit-destroy'),
]
