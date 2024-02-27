import { useState, useEffect, useRef } from "react";
import axiosInstance from "../axiosInstance";
import Video from "../components/videoPlayer/Video";
import { useParams, Link } from "react-router-dom";
import "./css/CutVideo.css";
export const PlayOriginalVideos = () => {
  const mutedRef = useRef(true);
  const [videoList, setVideoList] = useState([]);
  useEffect(() => {
    async function getVideos() {
      try {
        const response = await axiosInstance.get(`getallvideos/`);
        setVideoList(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    getVideos();
  }, []);

  return (
    <>
      <div className="app">
        <div className="containers">
          {videoList.length != 0
            ? videoList.map((video) => {
                var comments = 100;
                var likes = 100;
                var shares = 100;
                var description = "demo testing purposes description";
                var channel = "demo channel";
                var song = "demo song";
                var video_id=video.video_id
                var video_path= video.video_path.split("/")[2];
                console.log(video_path)
                var video_name = video_path.split('.')[0];
                console.log(video_name)
                console.log(video_id)
                var url = `https://app.test.fractalnetworks.co/hls/playlist_${video_name}.m3u8`;


                return (
                  <Video
                    key={video.video_id}
                    comments={comments}
                    video_id={video_id}
                    mutedRef={mutedRef}
                    likes={likes}
                    shares={shares}
                    description={description}
                    channel={channel}
                    song={song}
                    type="original"
                    url={url}
                  />
                );
              })
            : "No Videos to Load"}
        </div>
      </div>
    </>
  );
};
