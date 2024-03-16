from django.urls import path,re_path

from replyapp import views
urlpatterns = [
    path('getallreplyvideos/<int:original_video_id>/',views.get_all_reply_video_list),
    path('streamreplyvideo/<int:reply_video_id>/',views.stream_reply_video),
]
