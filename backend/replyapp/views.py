# views.py
import os
import subprocess
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from videouploadapp.tasks import generate_subtitles,cut_video,video_streamer
from django.http import StreamingHttpResponse
from videouploadapp.models import cut_video_subtitle_storage_model,subtitle_storage_model
import traceback
from replyapp.models import video_reply_model
@csrf_exempt
def get_all_reply_video_list(request,original_video_id):
    try:
        original_video=subtitle_storage_model.objects.get(id=original_video_id)
        videos=video_reply_model.objects.filter(replied_to=original_video).order_by('-id')
        print(videos)
        video_data=[]
        for video in videos:
            video_data.append({'video_id':video.id,'video_path':video.video_name})

        return JsonResponse({'data':video_data})
    except Exception as e:
        error=str(e)
        print(error)
        return JsonResponse({"status":"error","message":f"unexpected error {error}"},400)



@csrf_exempt
def stream_reply_video(request,reply_video_id):
    try:
        pass

    except Exception as e:
        error=str(e)
        print(error)
        return JsonResponse({'status':"error","message":f"unexpected error occured"})

