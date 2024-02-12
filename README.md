videoTranscriber

so first of all i manually created a wav file from mp4 file using ffmpeg 

``` ffmpeg -i taskiq.mp4 taskiq.wav```

The video used for demo purpose is the video justin sir sent for taskiq

In the server i have already installed the dependencies in env in videotranscriber folder 

But the only dependency to install is openai-whisper

There are two files in demo folder the first one is savesubtitlestofile.py which saves the subtitles to file i have used file based system for now but in production i will change it into database .

Running this file in python3 savesubtitlestofile.py generates two file one stores the subtitles as array and another stores timestamp as array 


And then there is cutvideo.py which loads both files and then get the starting and ending index of word array based on input array.
Once the starting and ending index are retrieved we can use same index to get data from timestamps array  which is used to cut the video.

The comparison happens when the first word of subtitle array matches the first word of input array it also checks the last word of input array to subtitlearray[i+len(input_array)-1] if it matches then we can get starting and ending index.

There could be the chance of duplication but it will be super rare.

Then u can rsync the cut video in your file and run with video player.

All other commits were deleted when i was running rsync i mistakely removed .git 
