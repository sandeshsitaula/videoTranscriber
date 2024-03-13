import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../axiosInstance";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/virtual';
import { CaptureEvent } from './CaptureEvent';
import "./css/cutVideoSnap.css";
import VideoSnap from "../components/videoPlayer/VideoSnap";
const VideoComponent=()=>{
   const mutedRef = useRef(true);
  const [videoList, setVideoList] = useState([]);
  const [loadedVideos, setLoadedVideos] = useState([]);
  const [loadedVideosCount, setLoadedVideosCount] = useState(0);
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

  useEffect(() => {
    loadNextVideos();
  }, [videoList]);

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
return(
          <div className="app">
            <div className="containers">
              <Swiper
                direction="vertical"
                spaceBetween={0}
                slidesPerView={1}
              >
                {loadedVideos.map((video, index) => (
                  <SwiperSlide key={index}>
                    <div style={{ backgroundColor: "#000" }} key={index}>
                      <VideoSnap
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

)
}

const PlayOriginalVideosSnap = () => {
  const [activeComponent, setActiveComponent] = useState('video'); // Initial state
  const [isSwiping, setIsSwiping] = useState(false); // Track ongoing swipe

  useEffect(() => {
    const handleTouchStart = (event) => {
      const startX = event.clientX || event.touches[0].clientX; // Handle both touch and mouse events
      const startY = event.clientY || event.touches[0].clientY; // Handle both touch and mouse events

      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('mousemove', handleTouchMove); // Added mousemove event listener
      document.addEventListener('touchend', handleTouchEnd);
      document.addEventListener('mouseup', handleTouchEnd); // Added mouseup event listener

      function handleTouchMove(event) {
        const currentX = event.clientX || event.touches[0].clientX; // Handle both touch and mouse events
        const currentY = event.clientY || event.touches[0].clientY; // Handle both touch and mouse events

        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
      console.log(deltaX,deltaY)
        // Check if the absolute horizontal displacement is greater than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          setIsSwiping(true); // Indicate potential swipe
        }
        console.log("here")
        if ( Math.abs(deltaX) > MIN_SWIPE_DISTANCE) { // Adjusted for minimum swipe distance
          console.log("here1")
          if (deltaX < 0) { // Swipe left
            setActiveComponent('captureEvent'); // Show CaptureEvent
          } else if (deltaX > 0) { // Swipe right
            setActiveComponent('additionalComponent'); // Show AdditionalComponent
          }
        }
      }

      function handleTouchEnd() {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('mousemove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.removeEventListener('mouseup', handleTouchEnd);
        setIsSwiping(false); // Reset swiping state
      }
    };

    const MIN_SWIPE_DISTANCE = 50; // Adjust based on your sensitivity requirement

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('mousedown', handleTouchStart); // Added mousedown event listener

    // Cleanup function to remove event listeners on component unmount
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('mousedown', handleTouchStart);
    };
  }, []); // Empty dependency array to run the effect only once

  return (
    <>
      {activeComponent === 'video' && <VideoComponent />}

      {/* CaptureEvent component (shown on swipe left) */}
      {activeComponent === 'captureEvent' && <CaptureEvent />}

      {/* AdditionalComponent component (shown on swipe right) */}
      {activeComponent === 'additionalComponent' && <div>hello</div>}
    </>
  );
};

export default PlayOriginalVideosSnap;
