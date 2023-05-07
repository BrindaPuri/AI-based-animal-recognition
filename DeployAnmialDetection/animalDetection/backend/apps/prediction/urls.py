from django.urls import include, path
from .views import DetectionView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers

router = routers.DefaultRouter()
# router.register('detect', DetectionView.as_view({'get': 'ifdetectAnimal'}), basename='detect')
router.register('', DetectionView)

urlpatterns = [
    path('', include(router.urls)),
    # path('detect/', DetectionView.as_view({'get': 'ifdetectAnimal'}))
    # path(r'^$', DetectionView.as_view({'get': 'ifdetectAnimal'}), name='ifdetectAnimal')
]
