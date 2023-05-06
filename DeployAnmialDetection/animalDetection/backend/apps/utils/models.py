from django.db import models

# Create your models here.

class MultipleImage(models.Model):
    images = models.FileField()
