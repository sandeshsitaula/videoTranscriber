import json
import whisper
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

