from django.shortcuts import render
from .models import ImageList
from pathlib import Path
from django.http import HttpResponse
from rest_framework import viewsets
from .serializers import ImageListSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
# Create your views here.

# def (request):
#     if request.method == "POST":
#         images = request.FILES.getlist('images')
#         for image in images:
#             ImageList.objects.create(images=image)
#     images = ImageList.objects.all()
#     return render(request, 'main.html', {'images': images})


    # if request.method == "POST":
    #     images = request.FILES.getlist('images')
    #     for image in images:
    #         MultipleImage.objects.create(images=image)
    # images = MultipleImage.objects.all()
    # return render(request, 'index.html', {'images': images})

class ImageListView(viewsets.ModelViewSet):
    queryset = ImageList.objects.all()
    serializer_class = ImageListSerializer

    def removeAll(self):
        for item in ImageList.objects.all():
            if item.images:
                item.images.delete()
            item.delete()
            print("deleted\n")

    def create(self, request):
        self.removeAll()
        serializer = ImageListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return HttpResponse("image in", status=200)
        else:
            print('error', serializer.errors)
            return HttpResponse("serializer failed", status=400)
