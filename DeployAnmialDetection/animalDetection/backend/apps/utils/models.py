from django.db import models

# Create your models here.

class ImageList(models.Model):
    images = models.ImageField()
