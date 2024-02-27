# from django
from django.contrib.auth import authenticate, login, logout
# from rest framework
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework import serializers
# serializers
from .serializers import UserModelSerializer, CreateUserModelSerializer
# models
from .models import CustomUser


class LoginView(APIView):
    """
    Logs in a user.

    If authentication succeeds, log the user in and return a 200 response.
    If authentication fails due to incorrect password, return a 401 error with a specific message.
    If authentication fails due to an invalid username, return a 401 error with a specific message.
    """
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({'success': 'Successful login'}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Incorrect username or password"}, status=status.HTTP_400_BAD_REQUEST)



class LogoutView(APIView):
    """
    View to log out an authenticated user.

    If the user is authenticated, log them out and return a 200 response. 
    If the user is not authenticated, return a 401 error.
    """
    def get(self, request):
        if request.user.is_authenticated:
            logout(request)
            return Response({"success": "Successfully logged out"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Authentication credentials were not provided"}, status=status.HTTP_401_UNAUTHORIZED)


class RegisterView(APIView):
    """
    Registers a new user.  

    If the data is valid, creates a new user and returns a 201 response.
    If the data is invalid, returns a 400 response with validation errors.
    """
    serializer_class = CreateUserModelSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            CustomUser.objects.create_user(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            return Response({'success': 'Successfully registered'}, status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)


class GetUserView(APIView):
    """
    View to get details of the currently authenticated user.  

    If the user is authenticated, return a 200 response with the serialized user data.
    If the user is not authenticated, return a 401 error.
    """
    def get(self, request):
        if request.user.is_authenticated:
            serializer = UserModelSerializer(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Authentication credentials were not provided"}, status=status.HTTP_401_UNAUTHORIZED)


class ValidateUsernameView(APIView):
    """
    View to check if a username is available.

    If the username is available, return a 200 response with the serialized user data.
    If the username is not available, return a 200 response with the serialized user data.
    """
    def post(self, request):
        username = request.data.get('username')
        if CustomUser.objects.filter(username=username).exists():
            return Response({"IsAvailable": False}, status=status.HTTP_200_OK)
        else:
            return Response({"IsAvailable": True}, status=status.HTTP_200_OK)
