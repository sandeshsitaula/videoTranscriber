from django.urls import path,re_path

from videouploadapp import views
urlpatterns = [
    path('videoupload/',views.video_upload),
    path('cutvideo/',views.cut_video_request),
    re_path(r'^filedownload/(?P<filename>.+)/$', views.file_download),
]
