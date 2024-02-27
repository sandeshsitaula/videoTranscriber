import React, { useRef, useState, useEffect } from "react";
import "./css/Video.css";
import VideoFooter from "./VideoFooter";
import axiosInstance from "../../axiosInstance";
import Hls from "hls.js";

import VideoSidebar from "./VideoSidebar";
function Video({
  mutedRef,
  url,
  song,
  description,
  video_id,
  channel,
  likes,
  comments,
  shares,
  type,
  lastId=-1,
  currIndex=null,
  totalLoadedVideoCount=null,
  loadNextVideos=null
}) {
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef(null);
  const hlsLoaded = useRef(false);

  const onVideoPress = () => {
    if (mutedRef.current) {
      mutedRef.current = false; // If currently muted, unmute it
      videoRef.current.muted = false;
      return;
    }
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };
useEffect(()=>{
  async function prefetcher(){
    var backend_url=""
          if (type=="cut"){
            backend_url=`streamcutvideo/${video_id}`
          }else{
            backend_url=`streamoriginalvideo/${video_id}`
          }
          const response = await axiosInstance.get(
            backend_url
          );
      if (Hls.isSupported()) {
    var newHls = new Hls();
    newHls.loadSource(url);
    newHls.attachMedia(videoRef.current);
    hlsLoaded.current = true;
    if (lastId==-1 || lastId==video_id){
      videoRef.current.play()
    }
  } else{
    alert("not supported")
  }
}
          prefetcher()
},[])
  useEffect(() => {
    const videoElement = videoRef.current;

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.2, // Adjust threshold as needed
    };

    const handleIntersection = async (entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          // Load video content when it comes into view
          if (hlsLoaded.current) {
            videoRef.current.play();
            setPlaying(true);
          }
          //videoRef.current.play(); // Start playing the video immediately after attaching HLS instance
          if (!mutedRef.current) {
            videoRef.current.muted = false;
          }
          if (totalLoadedVideoCount && currIndex && totalLoadedVideoCount-2==currIndex){
            loadNextVideos()
          }
        } else {
          videoRef.current.pause();
          setPlaying(false);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    if (videoElement) {
      observer.observe(videoElement);
    }

    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, [url]);

  useEffect(() => {
    if (!mutedRef.current) {
      videoRef.current.muted = false;
    }
  }, [mutedRef.current]);

  useEffect(() => {
    if (videoRef.current) {
      // Set the muted property of the video element
      videoRef.current.muted = mutedRef.current;
    }
  }, [hlsLoaded]);

  return (
    <div className="video">
      <video
        onClick={onVideoPress}
        className="player"
        muted={mutedRef.current}
        ref={videoRef}
        loop
        playsInline
      >
      </video>

      <div className="bottom-controls">
        <div className="footer-left">
          {/* The left part of the container */}
          <VideoFooter
            channel={channel}
            description={description}
            song={song}
          />
        </div>
        <VideoSidebar comments={comments} shares={shares} likes={likes} />
      </div>
    </div>
  );
}
export default Video;
