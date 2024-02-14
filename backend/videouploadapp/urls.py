from django.urls import path 
from videouploadapp import views
urlpatterns = [
    path('videoupload/',views.video_upload),
    path('cutvideo/',views.cut_video_request)
]
