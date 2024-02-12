# from django
from django.urls import path
# views
from .views import LoginView, LogoutView, RegisterView, GetUserView, ValidateUsernameView

urlpatterns = [

    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),
    path('user/', GetUserView.as_view(), name='get-user'),
    path('validate-username/', ValidateUsernameView.as_view(), name='validate-username'),
]