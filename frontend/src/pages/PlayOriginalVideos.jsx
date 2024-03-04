
import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../axiosInstance";
import Video from "../components/videoPlayer/Video";
import "./css/CutVideo.css";

export const PlayOriginalVideos = () => {
  const mutedRef = useRef(true);
  const [videoList, setVideoList] = useState([]); // State to store all videos
  const [loadedVideos, setLoadedVideos] = useState([]); // State to store the loaded videos
  const [loadedVideosCount,setLoadedVideosCount]=useState(0)

  const [tempLoadedVideosCount,setTempLoadedVideosCount]=useState(0)
  const videosPerLoad = 6; // Number of videos to load per batch
  const previousIndex = useRef(0); // Ref to store the previous index

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



  const loadNextVideos = () => {
    if (videoList.length == 0) {
      return;
    }

    const nextVideos = videoList.slice(
      loadedVideosCount,
      loadedVideosCount + videosPerLoad
    );
    setLoadedVideos(prevVideos => [...prevVideos, ...nextVideos]);
    setLoadedVideosCount((prev)=>prev+videosPerLoad)
    setTempLoadedVideosCount((prev)=>prev+videosPerLoad)
  };


  // Effect to load the next batch of videos when the component mounts
  useEffect(
    () => {
      loadNextVideos();
    },
    [videoList]
  );

  return (
    <div className="app">
      <div className="containers">
        {loadedVideos.map((video, index) => (
          <div key={video.video_id} style={{ height: "100vh" }}>
            <Video
            key={video.video_id}
              comments={100}
              video_id={video.video_id}
              mutedRef={mutedRef}
              likes={100}
              shares={100}
              description="demo testing purposes description"
              channel="demo channel"
              song="demo song"
              type="original"
              url={`https://app.test.fractalnetworks.co/hls/playlist_${
                video.video_path.split("/")[2].split(".")[0]
              }.m3u8`}
              lastId={videoList[0].video_id}
              currIndex={index}
              totalLoadedVideoCount={loadedVideosCount}
              loadNextVideos={loadNextVideos}
              previousIndex={previousIndex}
            />
          </div>
        ))}
        {videoList.length === 0 && "No Videos to Load"}
      </div>
    </div>
  );
};

export default PlayOriginalVideos;
