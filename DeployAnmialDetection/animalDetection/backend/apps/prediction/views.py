from django.shortcuts import render
import joblib
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
        model = joblib.load("/faster/SeniorProject/AI-based-animal-recognition/DeployAnmialDetection/ML/yolov8.joblib")
        result = model.predict(settings.MEDIA_ROOT)
        with open(Path(settings.MEDIA_ROOT / "animal_detection.txt").as_posix(),"w") as file:
            for item in result:
                file.write("%s\n" % item)
        print('done')
        return HttpResponse("result get", status=200)

