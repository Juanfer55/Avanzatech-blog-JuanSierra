# from django
from django.contrib import admin
# models
from permissions.models import PermissionLevels


class PermissionLevelsAdmin(admin.ModelAdmin):
    """
    Registers the Permission model with the Django admin site.
    """
    list_display = ['id', 'permission_level', 'created_at',]
    search_fields = ['permission_level',]
    ordering = ['id']
    readonly_fields = ('id', 'created_at', 'modified_at',)
    fieldsets = (
        ('Permission Information', {
            'fields': ('permission_level', 'created_at', 'modified_at'),
        }),
    )

    add_fieldsets = (
        ('Creat Permission', {
            'classes': ('wide',),
            'fields': ('permission_level'),
        }),
    )

    list_filter = ('permission_level',)


admin.site.register(PermissionLevels, PermissionLevelsAdmin)
