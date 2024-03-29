## VideoStreaming Project 


This project is used for capturing events by clients which can be streamed to other users using the website where the user can   reply with their own videos or view the replied videos.
Other actions like cutting video,capturing eventliking,commenting or sharing the videos can also be performed(some of them not implemented yet).


For this project Reactjs is used as frontend and django as backend and nginx for serving the video files from server to client using hls if supported or just serving pure video for emulators where hls is not supported . For hls (hls.js) library is used. 


Docker is used for managing and deploying all the services and self hosted gateway is used to directly deploy (frontend,backend,nginx) from docker-compose.yml file.
The credentials generated by  the selfhosted gateway are store in .env.{frontend,backend,nginx} where each stores credentials for their own services.
So if domain changes for any services later in the future after generating credentials for that particular service u would have to update the .env.{necessary service} file as well.

Also if the url for any service is changed you would have to update .env file as well which contains database configuration and backend and nginx url.

### Working For Subtitle generation and video Cutting
For subtitle generation we use whisper ai which is already present in requirements.txt in backend folder.  So we generate subtitles along with timestamps which will be used later to cut the video. For now tiny model is used for subtitle generation and can be changed later based on the requirements.
For subtitle generation we have to convert the video file to audio file as well which is done  by ffmpeg.Once the audio is generated whishper does the transcribing to generate subtitle and store it in database model(model name not good will be changed in actual implementation) . The subtitle are also shown to user who can decide what part of subtitle to cut. For cutting video we calculate the start timestamp and endtimestamp based on input subtitle with simple comparison . After the start and end timestamps are generated ffmpeg directly cuts the video and encoding of video is also done which will take some time for large video.

Video cutting can be accessed from https://domainname/cutvideo endpoint

### Working for Video Streaming 
After the videos are uploaded and subtitle are generated they are stored in their respective model either in original video model or cutvideomodel or reply model.
When we access the http://domainnameforbackend/api/streamoriginalvideo/{video_id}/ then the view basically starts ffmpeg command to generate a playlist_{videoname}.m3u8 file which is then served by nginx from endpiont https://domainnamefornginx/hls/playlist_{videoname}.m3u8

All these request are handled by frontend at one time. The playlist file generation process is synchrnous for now which can be changed later so that it can be handled by taskiq in the background.

The endpoint for videostreaming in frontend is https://domainforfrontend/playallsnap or for playing video in tiktok style or https://domainnameforfrontend/playvideo/{video_name} for playing a specific video.

So basically ffmpeg generates a playlist_.m3u8 file along with various segments of the videofile which is connected to the volume with nginx from docker compose file and nginx takes care of serving the necessary hls file based on the request from frontend.

The nginx configuration can be found in nginx folder in videotranscriber folder in the server.

### Working for CaptureEvent

Capture Event uses mediarecorder api in your browser to access the device camera for video recording.For devices like computer with only 1 camera it doesnot show icon for camera swapping . After u record a video then u can simply click on stop recording icon and then click on tick icon which is use for uploading the video to server . The video is also uploaded in chunks  of size 10MB and the size of django server file handling size is also increased to 10mb such that the file is directly stored in main memory of server which makes the overall process fast.

After clicking in tick icon it wont show anything while uploading file to server so no need to click the icon again (some loading sign will be added in future to tackle this problem).
Capture Event component is also responsible for recording the reply video.
The endpoint for captureevent is https://domainforfrontend/catpureevent



### For deployment 
Simply run docker-compose up for deploying and if the domain name are changed in self hosted gateway then u will have to change in .env{service} file and .env file as well if the domain name changed is of backend or nginx and rest should work as normal.



