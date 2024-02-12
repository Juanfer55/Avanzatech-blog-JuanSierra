# from django
from django.db import models
from django.core import validators
from django.utils.translation import gettext_lazy as _
# Models
from shared.base_model import BaseModel

class Categories(BaseModel, models.Model):

    name = models.CharField(_('Name'), max_length=50, validators=[
        validators.MinLengthValidator(1), validators.MaxLengthValidator(50)])

    REQUIRED_FIELDS = ['name']

    class Meta:
        ordering = ['pk']
        verbose_name = 'Categories'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        """
        Run all field validations before saving the model instance.
        """
        self.full_clean()
        super().save(*args, **kwargs)
