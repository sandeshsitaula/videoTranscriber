import json
import whisper
import os
import subprocess
from videouploadapp.models import subtitle_storage_model

def generate_subtitles(audio_path,video_name):
    subtitle_string=""
    try:
        if_video_exists=subtitle_storage_model.objects.filter(video_name=video_name)[:1]
        if len(if_video_exists)==0:

            model = whisper.load_model("tiny")
#using the model with the audio file and word_timestamp as true
            transcript = model.transcribe(
                word_timestamps=True,
                audio=audio_path
                )

            word_array=[]
            timestamp_array=[]
            #store each word in hashmap with timestamp
            for segment in transcript['segments']:
                for word in segment['words']:
                    formatted_word=word['word'].lstrip()
                    word_array.append(formatted_word)
                    timestamp_array.append((word['start'], word['end']))

            subtitle_storage_model.objects.create(
                video_name=video_name,
                subtitle_array= word_array,
                timestamp_array=timestamp_array
                )
            subtitle_string=' '.join(word_array)
        else:
            subtitle_string=' '.join(if_video_exists[0].subtitle_array)

        return subtitle_string
    except Exception as e:
        error=str(e)
        print(error)
        return error

# Find the start and end indices of the subtitle array based on the matching words
def find_indices_of_input(array, input_words):
    print(array,'***********',input_words)
    start_idx=None
    end_idx=None
    for i, subtitle in enumerate(array):
        if subtitle==input_words[0] and array[i+len(input_words)-1] and array[i+len(input_words)-1]==input_words[len(input_words)-1]:
            start_idx=i
            end_idx=i+len(input_words)-1
            break

    return start_idx, end_idx

def cut_video_command(input_video, output_video, start_time, end_time):
    start_time_str = str(int(start_time))
    end_time_str = str(int(end_time))
    # Command to cut the video using ffmpeg
    command = ['ffmpeg', '-y', '-copyts', '-i', input_video, '-ss',start_time_str, '-to', end_time_str, '-c:v', 'libx264', '-preset', 'ultrafast','-crf', '23', '-c:a', 'aac', '-b:a', '128k', output_video]    # Run the command
    subprocess.run(command)


def cut_video(video_name,subtitle_to_cut):
    try:
        new_subtitle_array=subtitle_to_cut.replace('\n',"").split(' ')
        video_dir='media/video'
        cut_video_dir='media/cut'
        if not os.path.exists(cut_video_dir):
                os.makedirs(cut_video_dir)

        input_video_path=os.path.join(video_dir,f'{video_name}.mp4')
        output_video_path=os.path.join(cut_video_dir,f'{video_name}_cut.mp4')
        get_data_from_db=subtitle_storage_model.objects.filter(video_name=input_video_path)[:1]

        start_index, end_index = find_indices_of_input(get_data_from_db[0].subtitle_array, new_subtitle_array)
        if start_index is None:
            return {'status':'error',"message":"Your subtitle substring doesnot exist"}

        timestamp_start=float(get_data_from_db[0].timestamp_array[start_index].split(',')[0].strip('()'))

        timestamp_end=float(get_data_from_db[0].timestamp_array[end_index].split(',')[1].strip('()'))
        print(get_data_from_db[0].timestamp_array)
        print(timestamp_start,timestamp_end)
        cut_video_command(input_video_path,output_video_path,timestamp_start,timestamp_end)
        return {'status':'OK','message':"video cut successfully"}

    except Exception as e:
        err=str(e)
        print(err)
        return {'status':'error',"message":f"error {err}"}

'''



def cut_video(input_video, output_video, start_time, end_time):
    start_time_str = str(int(start_time))
    end_time_str = str(int(end_time))
    # Command to cut the video using ffmpeg
    command = ['ffmpeg', '-y', '-copyts', '-i', input_video, '-ss',
start_time_str, '-to', end_time_str, '-c:v', 'libx264', '-preset', 'ultrafast',
'-crf', '23', '-c:a', 'aac', '-b:a', '128k', output_video]    # Run the command
    subprocess.run(command)



start_index, end_index = find_indices_of_input(word_array, input_text)
print(timestamp_array[start_index],timestamp_array[end_index])

input_video = 'taskiq.mp4'
output_video = 'cut_taskiq.mp4'
start_time = timestamp_array[start_index][0]
end_time = timestamp_array[end_index][1]

cut_video(input_video, output_video, start_time, end_time)
print(start_index,end_index)
'''
