# from django
from django.db import models
from django.core import validators
# Models
from shared.base_model import BaseModel


class Teams(BaseModel, models.Model):
    """
    Team model for the blog_avanzatech project.

    Defines Team object with name.
    """
    name = models.CharField(blank=False, null=False,  max_length=20, validators=[
        validators.MinLengthValidator(1), validators.MaxLengthValidator(20)])
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Teams'
        verbose_name_plural = 'Teams'

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        """
        Run all field validations before saving the model instance.
        """
        self.full_clean()
        super().save(*args, **kwargs)
