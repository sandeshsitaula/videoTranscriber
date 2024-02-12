import json
import whisper

word_array=[]
timestamp_array=[]

model = whisper.load_model("tiny")

#using the model with the audio file and word_timestamp as true
transcript = model.transcribe(
    word_timestamps=True,
    audio="./taskiq.wav"
)

#store each word in hashmap with timestamp
for segment in transcript['segments']:
    for word in segment['words']:
        formatted_word=word['word'].lstrip()
        word_array.append(formatted_word)
        timestamp_array.append((word['start'], word['end']))

with open('taskiq_word_file.json','w') as f:
   json.dump(word_array,f) 

with open('taskiq_timestamp_file.json','w') as f:
    json.dump(timestamp_array,f)
