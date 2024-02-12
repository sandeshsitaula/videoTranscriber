import json
import subprocess

# Load the array from the JSON file
def load_array_from_file(file_name):
    with open(file_name, 'r') as file:
        array_data = json.load(file)
    return array_data

# Find the start and end indices of the subtitle array based on the matching words
def find_indices_of_input(array, input_words):
    start_idx=None
    end_idx=None
    print(len(input_words))
    for i, subtitle in enumerate(array):
        if subtitle==input_words[0] and array[i+len(input_words)-1] and array[i+len(input_words)-1]==input_words[len(input_words)-1]:
            start_idx=i
            end_idx=i+len(input_words)-1

    return start_idx, end_idx


def cut_video(input_video, output_video, start_time, end_time):
    start_time_str = str(int(start_time))
    end_time_str = str(int(end_time))
    # Command to cut the video using ffmpeg
    command = ['ffmpeg', '-i', input_video, '-ss', start_time_str, '-to', end_time_str, '-c', 'copy', output_video]
    # Run the command
    subprocess.run(command)


word_file_name="taskiq_word_file.json"
timestamp_file_name="taskiq_timestamp_file.json"

word_array=load_array_from_file(word_file_name)
timestamp_array=load_array_from_file(timestamp_file_name)

input_text=["when", "I", "launch", "main,", "we're", "going", "to", "kick", "this,", "uh,", "add", "two", "tasks", "passing", "in", "three.", "We", "should,", "we", "should", "expect", "to", "see", "a", "task", "result,", "colon", "five,", "because", "that's", "just,", "uh,", "that's", "all", "this", "is", "doing", "is", "adding", "three", "plus", "two", "and", "then", "exiting.", "So"]

start_index, end_index = find_indices_of_input(word_array, input_text)
print(timestamp_array[start_index],timestamp_array[end_index])

input_video = 'taskiq.mp4' 
output_video = 'cut_taskiq.mp4' 
start_time = timestamp_array[start_index][0]
end_time = timestamp_array[end_index][1]

cut_video(input_video, output_video, start_time, end_time)
print(start_index,end_index)
