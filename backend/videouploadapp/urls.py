from django.urls import path,re_path

from videouploadapp import views
urlpatterns = [
    path('videoupload/',views.video_upload),
    path('cutvideo/',views.cut_video_request),
    re_path(r'^filedownload/(?P<filename>.+)/$', views.file_download),
    path('getallvideos/',views.get_all_original_video_list),
    path('getcutvideos/<int:video_id>/',views.get_cutvideo_list),
    path('streamcutvideo/<int:cut_video_id>/',views.stream_cut_video),
    path('streamoriginalvideo/<int:video_id>/',views.stream_original_video),
]
