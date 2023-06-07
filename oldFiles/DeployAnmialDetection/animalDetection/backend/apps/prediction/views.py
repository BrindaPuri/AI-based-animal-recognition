from django.shortcuts import render
from ultralytics import YOLO
from .models import Prediction
from .serializers import PredictionSerializer
from django.http import HttpResponse
from django.conf import settings
from pathlib import Path
import json
from rest_framework import viewsets
# Create your views here.

class DetectionView(viewsets.ModelViewSet):
    queryset=Prediction.objects.all()
    serializer_class = PredictionSerializer

    def list(self, request):
        model = YOLO(Path(settings.BASE_DIR /'ML/best.pt').as_posix())
        result = model.predict(settings.MEDIA_ROOT)
        with open(Path(settings.MEDIA_ROOT / "animal_detection.txt").as_posix(),"w") as file:
            file.write("all classes:" % result[0].names)
            for item in result:
                # file.write("item id: %s\n" % item.cls[0].item())
                # file.write("item coordinates: %s\n" % item.xyxy[0].tolist())
                # file.write("item probability: %s\n" % item.conf[0].item())
                file.write("%s\n" % item)
        print('done')
        return HttpResponse("result get", status=200)

