# from django
from django.contrib import admin
# models
from .models import Teams


class TeamsAdmin(admin.ModelAdmin):
    """
    Teams admin model for the Django admin site.
    """
    list_display = ['id', 'name', 'created_at', 'modified_at']
    search_fields = ['name']
    fieldsets = (
        ('Team Information', {
            'fields': ('name', ),

        }),
    )

    add_fieldsets = (
        ('Team Information', {
            'classes': ('wide',),
            'fields': ('name',),
        }),
    )

    list_filter = ('name',)


admin.site.register(Teams, TeamsAdmin)
