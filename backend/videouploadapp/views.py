# views.py
import os
import subprocess
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from videouploadapp.tasks import generate_subtitles,cut_video,video_streamer
from django.http import StreamingHttpResponse
from videouploadapp.models import cut_video_subtitle_storage_model,subtitle_storage_model
@csrf_exempt
def video_upload(request):
    try:
        if request.method == 'POST' and request.FILES.get('video'):
            video_chunk = request.FILES['video']
            chunk_number = int(request.POST.get('chunkNumber'))
            total_chunks = int(request.POST.get('totalChunks'))
            event_name=request.POST.get('eventName')
            video_filename = request.POST.get('videoName')
            total_videos = int(request.POST.get('totalVideos'))
            current_video = int(request.POST.get('currentVideo'))
            # Define the directory where you want to save the audio file

            #To give proper extension type
            if event_name is not None:
                extension_type='webm'
                filename=event_name
            else:
                extension_type='mp4'
                filename=video_filename


            if total_videos==1:
                filename=filename.split('_')[0]
            audio_dir = 'media/audio'
            video_dir='media/video'
            # Create the directory if it doesn't exist
            if not os.path.exists(audio_dir):
                os.makedirs(audio_dir)

            if not os.path.exists(video_dir):
                os.makedirs(video_dir)

            # Define the filename for the temporary chunk
            temp_chunk_path=os.path.join(video_dir,f'temp_chunk_{filename}{chunk_number}.{extension_type}')
            # Save the chunk to a temporary location
            with open(temp_chunk_path, 'wb+') as destination:
                for chunk in video_chunk.chunks():
                    destination.write(chunk)

            # If it's the last chunk, merge all chunks and convert to audio
            if chunk_number == total_chunks - 1:

                # Concatenate all chunks into one video file
                concatenated_chunks_path=os.path.join(video_dir,f'{filename}.{extension_type}')

                with open(concatenated_chunks_path, 'wb+') as destination:
                    for i in range(total_chunks):
                        chunk_path = os.path.join(video_dir, f'temp_chunk_{filename}{i}.{extension_type}')

                        with open(chunk_path, 'rb') as source:
                            destination.write(source.read())

                #if last video then run this if
                if  current_video==total_videos-1:
                    #for concatenating multiple
                    base_filename_temp=filename.split('_')
                    base_filename = '_'.join(base_filename_temp[:-1])
                    video_base_filepath=os.path.join(video_dir,base_filename)

                    if total_videos>1:
                        input_files = [f"{video_base_filepath}_{i}.{extension_type}" for i in range(total_videos)]

                        command = ["mkvmerge"]
                        # Add the -o option followed by the output file name
                        command.extend(["-o", f'{video_base_filepath}.{extension_type} '])
                        # Append each input file path
                        command.append(input_files[0])  # First input file does not need a +
                        command.extend(["+ " + input_file for input_file in input_files[1:]])
                        command_str = " ".join(command)
                        # Execute the command
                        subprocess.run(command_str, shell=True, check=True)

                        concatenated_chunks_path=f'{video_base_filepath}.{extension_type}'

                        for i in range (total_videos):
                            os.remove(f'{video_base_filepath}_{i}.{extension_type}')

                    audio_file_name = f'{base_filename}.wav'
                    audio_file_path = os.path.join(audio_dir, audio_file_name)
                    # Run ffmpeg to convert the video to audio
                    subprocess.run(['ffmpeg', '-y','-i', concatenated_chunks_path, '-vn', '-acodec', 'pcm_s16le', '-ar', '44100', '-ac', '2', audio_file_path], check=True)
                    generated_subtitle_data=generate_subtitles(audio_file_path,concatenated_chunks_path)

                    for i in range(total_chunks):
                        os.remove(os.path.join(video_dir, f'temp_chunk_{filename}{i}.{extension_type}'))


                    return JsonResponse({'status': 'success','data':generated_subtitle_data})

                # Clean up temporary files

                for i in range(total_chunks):
                    os.remove(os.path.join(video_dir, f'temp_chunk_{filename}{i}.{extension_type}'))
                return JsonResponse({'status':'sucess','message':"In progress"})


            else:
                return JsonResponse({'status': 'chunk_uploaded'})

        return JsonResponse({'status': 'error'}, status=400)

    except Exception as e:
        error=str(e)
        print(error)
        return JsonResponse({'status':"Error",'message':f"Unexpected error {error}"},status=400)


@csrf_exempt
def cut_video_request(request):
    try:
        data=json.loads(request.body)
        subtitle_to_cut=data.get('subtitleToCut')
        video_name=data.get('videoName')

        response=cut_video(video_name,subtitle_to_cut)
        if response['status']=='OK':

            return JsonResponse({'status':"success",'original_video':response['original_video'],'cut_video':response['cut_video'], "message" : "Video  successfully cut you can download now "},status=200)
        else:
            return JsonResponse({'status':"some error occured","message":response['message']},status=400)
    except Exception as e:
        error=str(e)
        print(error)
        return JsonResponse({'status':"Error","message":f"unexpected error:{error}"},status=400)

@csrf_exempt
def get_all_original_video_list(request):
    try:
        videos=subtitle_storage_model.objects.all().order_by('-id')
        video_data=[]
        for video in videos:
            video_data.append({'video_id':video.id,'video_path':video.video_name})

        return JsonResponse({'data':video_data})
    except Exception as e:
        error=str(e)
        print(error)
        return JsonResponse({"status":"error","message":f"unexpected error {error}"},400)

@csrf_exempt
def get_cutvideo_list(request,video_id):
    try:
        original_video=subtitle_storage_model.objects.get(id=video_id)
        all_cut_videos=cut_video_subtitle_storage_model.objects.filter(original_video_path=original_video.video_name)
        cut_video_data=[]
        for video in all_cut_videos:
            cut_video_data.append({'cut_video_id':video.id,'cut_video_path':video.cut_video_path})

        return JsonResponse({"status":"Ok",'data':cut_video_data})
    except Exception as e:
        error=str(e)
        print(error)
        return JsonResponse({'status':'error','message':f"unexpected error {error}"},400)

@csrf_exempt
def stream_original_video(request,video_id):
    try:
        video=subtitle_storage_model.objects.get(id=video_id)
        print(video.video_name)
        video_streamer(video.video_name,"original")
        return JsonResponse({'status':"ok",'message':"Started Streaming"})
    except Exception as e:
        error=str(e)
        print(error)
        return JsonResponse({'status':'error','message':f"unexpected error : {error}"})
@csrf_exempt
def stream_cut_video(request,cut_video_id):
    try:
        video=cut_video_subtitle_storage_model.objects.get(id=cut_video_id)
        #defined in tasks.py
        print(video.cut_video_path)
        video_streamer(video.cut_video_path,"cut")
        return JsonResponse({'status':'ok','message':"Started Streaming"})

    except Exception as e:
        error=str(e)
        print(error)
        return JsonResponse({'status':"error","message":f"unexpected error occured"})


@csrf_exempt
def file_download(request,filename):
    try:

        file_full_path = os.path.abspath(filename)
        if not os.path.exists(file_full_path):
            return HttpResponse("File not found", status=404)

        def file_iterator(file_path, chunk_size=1*1024*1024):
            with open(file_path, 'rb') as f:
                f.seek(0, os.SEEK_END)
                file_size = f.tell()

                range_header = request.headers.get('Range')
                if range_header:
                    start_byte, end_byte = range_header.strip().split('=')[1].split('-')
                    start_byte = int(start_byte)
                    end_byte = int(end_byte) if end_byte else file_size - 1

                    f.seek(start_byte)
                    remaining_bytes = end_byte - start_byte + 1
                    while remaining_bytes > 0:
                        chunk = f.read(min(chunk_size, remaining_bytes))
                        if not chunk:
                            break
                        yield chunk
                        remaining_bytes -= len(chunk)
                else:
                    f.seek(0)
                    while True:
                        chunk = f.read(chunk_size)
                        if not chunk:
                            break
                        yield chunk

        file_size = os.path.getsize(file_full_path)
        response = StreamingHttpResponse(file_iterator(file_full_path))
        response['Content-Disposition'] = 'attachment; filename="%s"' % os.path.basename(file_full_path)
        response['Content-Type'] = 'application/octet-stream'  # Set the Content-Type header
        response['Content-Length'] = file_size
        return response

    except Exception as e:
        error=str(e)
        print(error)
        return JsonResponse({'status':"Error","message":f"Unexpected error : {error}"},status=400)
