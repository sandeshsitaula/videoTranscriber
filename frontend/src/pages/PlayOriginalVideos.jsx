import React, { useState, useEffect,useRef } from "react";
import axiosInstance from "../axiosInstance";
import ReactFullpage from "@fullpage/react-fullpage"; // Import ReactFullpage components
import "./css/CutVideo.css";
import Video from "../components/videoPlayer/Video";

const PlayOriginalVideos = () => {
  const mutedRef = useRef(true);
  const [videoList, setVideoList] = useState([]); // State to store all videos
  const [loadedVideos, setLoadedVideos] = useState([]); // State to store the loaded videos
  const [loadedVideosCount,setLoadedVideosCount]=useState(0)

  const [,setTempLoadedVideosCount]=useState(0)
  const videosPerLoad = 6; 
  const previousIndex = useRef(0); 

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


  };


  // Effect to load the next batch of videos when the component mounts
  useEffect(
    () => {
      loadNextVideos();
    },
    [videoList]
  );
  return (
    <div style={{display:'flex',justifyContent:'center',backgroundColor:"gray"}}>
{/*    <div className="app">
//       <div className="containers">
  */}
  {loadedVideosCount>0&&

    <ReactFullpage

      licenseKey={import.meta.env.VITE_FULLPAGE_LICENSE_KEY} // Replace with your license key

        dragAndMove= {true}
        lazyLoading={true}
            keyboardScrolling={ true}
        scroll={true}
      scrollingSpeed={700} // Optional: Adjust scrolling speed (milliseconds)
      render={({ state, fullpageApi }) => (
        <ReactFullpage.Wrapper>
           {loadedVideosCount && loadedVideos.map((video, index) => {
          return(
           <div className="section "  style={{backgroundColor:"#000"}}key={index} >
                <Video
                  comments={100}
                  video_id={video.video_id}
                  mutedRef={mutedRef}
                  likes={100}
                  shares={100}
                  description="demo testing purposes description"
                  channel="demo channel"
                  song={video.video_path.split("/")[2].split(".")[0]}
                  type="original"
                  url={`${import.meta.env.VITE_NGINX_URL}/hls/playlist_${
                    video.video_path.split("/")[2].split(".")[0]
                  }.m3u8`}
                  lastId={videoList[0].video_id}
                  currIndex={index}
                  totalLoadedVideoCount={loadedVideosCount}
                  loadNextVideos={loadNextVideos}
                  previousIndex={previousIndex}
                />

          </div>)})}
        </ReactFullpage.Wrapper>
      )}
    />}
    </div>
  );
};

export default PlayOriginalVideos;
