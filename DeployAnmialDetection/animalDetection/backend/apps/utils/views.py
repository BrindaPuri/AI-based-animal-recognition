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
    serializer_class = ImageListSerializer
    queryset = ImageList.objects.all()

    # def post(self, request):
    #     data = json.loads(request.data)
    #     images = data['list']
    #     for image in images:
    #         ImageList.objects.create(images=image)
    #     images = ImageList.objects.all()
    #     return HttpResponse({'message': 'image stored'}, status=200)

    def create(self, request):
        serializer = ImageListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return HttpResponse({'message': 'image stored'}, status=200)
        else:
            print('error', serializer.errors)
            return HttpResponse({'message': 'image doesnt exist'}, status=400)
