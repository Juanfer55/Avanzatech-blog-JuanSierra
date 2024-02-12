# from django
from django.db import models


class BaseModel(models.Model):
    """
    This class implements the default fields for all models.

    Defines the fields created_at and modified_at.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
