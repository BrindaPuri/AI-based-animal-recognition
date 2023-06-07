from django.shortcuts import render
from .models import ImageList
from pathlib import Path
from django.http import HttpResponse
from rest_framework import viewsets
from .serializers import ImageListSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response

# import pandas as pd
# Create your views here.

class ImageListView(viewsets.ModelViewSet):
    queryset = ImageList.objects.all()
    serializer_class = ImageListSerializer

    def list(self, request):
        for item in ImageList.objects.all():
            if item.images:
                item.images.delete()
            item.delete()
            print("deleted\n")
        print("done deleting all")
        return HttpResponse("cleaned up all stored images", status=200)

    def create(self, request):
        # self.removeAll()
        serializer = ImageListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return HttpResponse("image in", status=200)
        else:
            print('error', serializer.errors)
            return HttpResponse("serializer failed", status=400)
