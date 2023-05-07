from rest_framework import serializers
from .models import ImageList

class ImageListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageList
        fields = '__all__'