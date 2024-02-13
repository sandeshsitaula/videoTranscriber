# views.py
import os
import subprocess
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def video_upload(request):
    if request.method == 'POST' and request.FILES.get('video'):
        video_chunk = request.FILES['video']
        chunk_number = int(request.POST.get('chunkNumber'))
        total_chunks = int(request.POST.get('totalChunks'))
        
        # Define the directory where you want to save the audio file
        audio_dir = 'media'
        # Create the directory if it doesn't exist
        if not os.path.exists(audio_dir):
            os.makedirs(audio_dir)

        # Define the filename for the temporary chunk
        temp_chunk_path = os.path.join(audio_dir, f'temp_chunk_{chunk_number}.mp4')
        
        # Save the chunk to a temporary location
        with open(temp_chunk_path, 'wb+') as destination:
            for chunk in video_chunk.chunks():
                destination.write(chunk)
        
        # If it's the last chunk, merge all chunks and convert to audio
        if chunk_number == total_chunks - 1:
            # Extract the filename from the uploaded video file
            video_filename = request.POST.get('videoName')
            print(video_filename)
            
            # Define the audio file name with the .wav extension
            audio_file_name = f'{video_filename}.wav'
            audio_file_path = os.path.join(audio_dir, audio_file_name)

            # Concatenate all chunks into one video file
            concatenated_chunks_path = os.path.join(audio_dir, 'concatenated_chunks.mp4')
            with open(concatenated_chunks_path, 'wb+') as destination:
                for i in range(total_chunks):
                    chunk_path = os.path.join(audio_dir, f'temp_chunk_{i}.mp4')
                    with open(chunk_path, 'rb') as source:
                        destination.write(source.read())

            # Run ffmpeg to convert the video to audio
            subprocess.run(['ffmpeg', '-i', concatenated_chunks_path, '-vn', '-acodec', 'pcm_s16le', '-ar', '44100', '-ac', '2', audio_file_path], check=True)
            
            # Clean up temporary files
            for i in range(total_chunks):
                os.remove(os.path.join(audio_dir, f'temp_chunk_{i}.mp4'))
            os.remove(concatenated_chunks_path)
            
            return JsonResponse({'status': 'success', 'audio_file_path': audio_file_path})
        else:
            return JsonResponse({'status': 'chunk_uploaded'})

    return JsonResponse({'status': 'error'}, status=400)
