# from django
from django.contrib.auth.admin import UserAdmin
from django.contrib import admin
# models
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    """
    Registers the User model with the Django admin site
    """
    list_display = ['id', 'username', 'team', 'is_admin', 'is_blogger', 'is_superuser']
    search_fields = ['username']
    fieldsets = (
        ('User Information', {
            'fields': ('username', 'team'),
        }),
        ('Permissions', {
            'fields': ('groups', 'user_permissions'),
        }),
        ('User status', {
            'fields': ('is_admin', 'is_superuser', 'is_staff'),
        }),
        ("Password Information", {
            'fields': ('password', )
        }),
    )

    add_fieldsets = (
        ('User Information', {
            'classes': ('wide',),
            'fields': ('username', 'team', 'password1', 'password2', 'is_admin', 'is_superuser', 'is_staff'),
        }),
    )

    filter_horizontal = ('groups', 'user_permissions')
    list_filter = ('is_admin', 'is_superuser', 'team')


admin.site.register(CustomUser, CustomUserAdmin)
