# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from videouploadapp.tasks import cut_video,video_streamer
from videouploadapp.models import subtitle_storage_model
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
        video=video_reply_model.objects.get(id=reply_video_id)
        #defined in tasks.py
        print(video.video_name)
        video_streamer(video.video_name,"reply")
        return JsonResponse({'status':'ok','message':"Started Streaming"})

    except Exception as e:
        error=str(e)
        print(error)
        return JsonResponse({'status':"error","message":f"unexpected error occured"})
