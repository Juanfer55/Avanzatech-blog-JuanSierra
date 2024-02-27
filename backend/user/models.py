# from django
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.core import validators
from django.contrib.auth.password_validation import validate_password
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
# models
from shared.base_model import BaseModel
from teams.models import Teams


class CustomUserManager(BaseUserManager):
    """
    Custom user model manager
    """
    def create_user(self, username, password=None, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not username:
            raise ValueError(_('Username is required'))

        if not password:
            raise ValueError(_('Password is required'))

        try:
            validate_password(password)
        except ValidationError as e:
            raise ValidationError(e.error_list[0])

        username = self.normalize_email(username)
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        """
        Creates and saves a superuser with the given email and password.
        """
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_staff', True)
        return self.create_user(username, password, **extra_fields)


class CustomUser(PermissionsMixin, AbstractBaseUser, BaseModel):
    """
    User model for the blog_avanzatech project.

    Defines additional fields like username, team, is_admin, 
    and custom manager for creating users.
    """
    username = models.EmailField(_('username'), max_length=120, unique=True, blank=False, null=False, validators=[
                                 validators.validate_email])

    password = models.CharField(_('password'), max_length=120,
                                blank=False, null=False, validators=[validate_password])

    team = models.ForeignKey(Teams, on_delete=models.CASCADE, default=1)

    is_admin = models.BooleanField(_('is admin'), default=False)

    is_staff = models.BooleanField(_('is staff'), default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['password']

    class Meta:
        ordering = ['id']
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    @property
    def is_blogger(self):
        """
        This property allows to display if a user is a blogger or not
        """
        return not self.is_admin

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        """
        Run all field validations before saving the model instance.
        """
        self.full_clean()
        super().save(*args, **kwargs)
