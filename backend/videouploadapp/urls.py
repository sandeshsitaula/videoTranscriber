from django.urls import path,re_path

from videouploadapp import views
urlpatterns = [
    #handles videoupload to generate subtitles and store it in necessary model
    path('videoupload/',views.video_upload),
    #cuts the video based on provided input and stored data in database
    path('cutvideo/',views.cut_video_request),
    # downloads a file from server based on path(directly handled by django server)
    re_path(r'^filedownload/(?P<filename>.+)/$', views.file_download),
    path('getallvideos/',views.get_all_original_video_list),
    path('getcutvideos/<int:video_id>/',views.get_cutvideo_list),

    #Two urls for now can be made into one in future(in new project)
    path('streamcutvideo/<int:cut_video_id>/',views.stream_cut_video),
    path('streamoriginalvideo/<int:video_id>/',views.stream_original_video),
]
