import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../axiosInstance";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/virtual";
import { CaptureEvent } from "./CaptureEvent";
import "./css/cutVideoSnap.css";
import VideoSnap from "../components/videoPlayer/VideoSnap";
import { useNavigate } from "react-router-dom";
const VideoComponent = (props) => {
  const mutedRef = useRef(true);
  const [videoList, setVideoList] = useState([]);
  const [loadedVideos, setLoadedVideos] = useState([]);
  const [loadedVideosCount, setLoadedVideosCount] = useState(0);
  const videosPerLoad = 6;
  const previousIndex = useRef(0);
    const containerRef = useRef(null);
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

  useEffect(
    () => {
      loadNextVideos();
    },
    [videoList]
  );

  const loadNextVideos = () => {
    if (videoList.length === 0) {
      return;
    }

    const nextVideos = videoList.slice(
      loadedVideosCount,
      loadedVideosCount + videosPerLoad
    );
    setLoadedVideos(prevVideos => [...prevVideos, ...nextVideos]);
    setLoadedVideosCount(prev => prev + videosPerLoad);
  };
  return (
    <div ref={containerRef} className="app">
      <div className="containers">
        <Swiper
        initialSlide={0} // Set initial index
        direction="vertical" initialstate={3} spaceBetween={0} slidesPerView={1}>

          {loadedVideos.map((video, index) => (
            <SwiperSlide key={index}>
              <div style={{ backgroundColor: "#000" }} key={index}>
                <VideoSnap
                setCurrentIndex={props.setCurrentIndex}  //to keep track of current INdex
                  comments={100}
                  video_id={video.video_id}
                  mutedRef={mutedRef}
                  likes={100}
                  shares={100}
                  description="demo testing purposes description"
                  channel="demo channel"
                  song={video.video_path.split("/")[2]}
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
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
const PlayOriginalVideosSnap = () => {
  let [activeComponent,setActiveComponent]=useState("video")
  const [swipeProcessed, setSwipeProcessed] = useState(false);
  const [currentIndex,setCurrentIndex]=useState(0)
      let MIN_SWIPE_DISTANCE = 100;
let varactiveComponent="video"
useEffect(()=>console.log(currentIndex))
  const navigate = useNavigate();
  useEffect(() => {
    const handleTouchStart = event => {
      const startX = event.clientX || event.touches[0].clientX; // Handle both touch and mouse events
      const startY = event.clientY || event.touches[0].clientY; // Handle both touch and mouse events

      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("mousemove", handleTouchMove); // Added mousemove event listener
      document.addEventListener("touchend", handleTouchEnd);
      document.addEventListener("mouseup", handleTouchEnd); // Added mouseup event listener

      function handleTouchMove(event) {

        const currentX = event.clientX || event.touches[0].clientX; // Handle both touch and mouse events
        const currentY = event.clientY || event.touches[0].clientY; // Handle both touch and mouse events

        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        if (MIN_SWIPE_DISTANCE!=100){
          return
        }
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          //           setSwipeProcessed(true); // Indicate potential swipe
        }
        if (Math.abs(deltaX) > MIN_SWIPE_DISTANCE) {
          // Adjusted for minimum swipe distance
          console.log(deltaX,activeComponent,MIN_SWIPE_DISTANCE,varactiveComponent)
          if (deltaX > 0) {
            if (varactiveComponent=="video"){
             MIN_SWIPE_DISTANCE*=1000
             setActiveComponent("captureEvent")
             varactiveComponent="captureEvent"
            }else if (varactiveComponent=="additionalComponent"){
             MIN_SWIPE_DISTANCE*=1000
            setActiveComponent("video")

             varactiveComponent="video"
            }
          } else if (deltaX < 0) {
             if (varactiveComponent=="video"){
             MIN_SWIPE_DISTANCE*=1000
             setActiveComponent("additionalComponent")
             varactiveComponent="additionalComponent"
            }else if (varactiveComponent=="captureEvent"){

             MIN_SWIPE_DISTANCE*=1000
            setActiveComponent("video")
            varactiveComponent="video"
            }
            };
          }
        }

      function handleTouchEnd() {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("mousemove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
        document.removeEventListener("mouseup", handleTouchEnd);
        MIN_SWIPE_DISTANCE=100
      }
    };
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("mousedown", handleTouchStart); // Added mousedown event listener

    // Cleanup function to remove event listeners on component unmount
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("mousedown", handleTouchStart);
        MIN_SWIPE_DISTANCE=100
    };
  }, []); // Empty dependency array to run the effect only once

  return (
    <>
      {activeComponent == "video" && <VideoComponent setCurrentIndex={setCurrentIndex}/>}

      {/* CaptureEvent component (shown on swipe left) */}
      {activeComponent == "captureEvent" && <CaptureEvent />}

      {/* AdditionalComponent component (shown on swipe right) */}
      {activeComponent == "additionalComponent" && <div>hello</div>}
    </>
  );
};

export default PlayOriginalVideosSnap;
