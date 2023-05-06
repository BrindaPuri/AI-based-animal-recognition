from django.shortcuts import render
from .models import MultipleImage
# Create your views here.

def upload(request):
    if request.method == "POST":
        images = request.FILES.getlist('images')
        for image in images:
            MultipleImage.objects.create(images=image)
    images = MultipleImage.objects.all()
    return render(request, 'main.html', {'images': images})
