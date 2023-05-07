from django.urls import include, path
from .views import ImageListView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers


# urlpatterns = [
#     path('', views.upload, name='upload')
#     ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


# router = routers.DefaultRouter()

# router.register(r'tasks',views.ImageListView, 'task')

router = routers.DefaultRouter()
router.register('djimagelist', ImageListView)

urlpatterns = [
    # path('', ImageListView.as_view(), name="imagelist")
    path('', include(router.urls))
# ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
