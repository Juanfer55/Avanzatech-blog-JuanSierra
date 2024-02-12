# from django
from django.db import models
from django.utils.translation import gettext_lazy as _
# Models
from shared.base_model import BaseModel


class PermissionLevels(BaseModel, models.Model):
    """
    Permission model for blog_avanzatech project.
    """

    permission_level = models.CharField(
        _('permission level'), max_length=50, unique=True, blank=False, null=False)

    REQUIRED_FIELDS = ['permission_level']

    class Meta:
        ordering = ['pk']
        verbose_name = 'Permissions'
        verbose_name_plural = 'Permissions'

    def __str__(self):
        return self.permission_level

    def save(self, *args, **kwargs):
        """
        Run all field validations before saving the model instance.
        """
        self.full_clean()
        super().save(*args, **kwargs)
