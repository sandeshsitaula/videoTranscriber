import React, { useRef, useState, useEffect } from "react";
import "./css/VideoSnap.css";
import VideoFooter from "./VideoFooter";
import axiosInstance from "../../axiosInstance";
import Hls from "hls.js";
import { Oval } from "react-loader-spinner";
import VideoSidebar from "./VideoSidebar";

export default function Video({
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
  lastId = -1,
  currIndex = null,
  totalLoadedVideoCount = null,
  loadNextVideos = null,
  previousIndex = null,
  setCurrentIndex = null
}) {
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef(null);
  const hlsInstanceRef = useRef(null);
  const listUpdated = useRef(null);
  const [loading, setLoading] = useState(true);
  const instance = useRef(null);
  let hlsInstance;

  const attachHlsMedia = async () => {
    setLoading(true);
    try {
      videoRef.current.play();
      setPlaying(true);
    } catch (error) {
      console.error("Error attaching HLS media:", error);
    } finally {
      setLoading(false);
    }
  };

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
  useEffect(
    () => {
      async function prefetcher() {
        var backend_url = "";
        if (type == "cut") {
          backend_url = `streamcutvideo/${video_id}`;
        } else if (type == "reply") {
          backend_url = `reply/streamreplyvideo/${video_id}`;
        } else {
          backend_url = `streamoriginalvideo/${video_id}`;
        }
        const response = await axiosInstance.get(backend_url);
        if (Hls.isSupported()) {
          hlsInstance = new Hls();
          hlsInstance.loadSource(url);
          hlsInstanceRef.current = hlsInstance;
          hlsInstance.attachMedia(videoRef.current);
          if (lastId == -1 || lastId == video_id) {
            attachHlsMedia();
          }
        } else {
          alert("HLS not supported");
        }
      }
      prefetcher();
    },
    [url]
  );

  useEffect(
    () => {
      const videoElement = videoRef.current;
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.2
      };

      const handleIntersection = entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !!hlsInstanceRef.current && loading) {
            attachHlsMedia();
          } else if (!entry.isIntersecting && videoRef && videoRef.current) {
            videoRef.current.pause();
            setPlaying(false);
          }
          if (entry.isIntersecting && videoRef && videoRef.current) {
            videoRef.current.play();
            setPlaying(true);
          }

          if (entry.isIntersecting && !loading && videoRef.current) {
            videoRef.current.play();
            setPlaying(true);
          }
          if (entry.isIntersecting && !!setCurrentIndex) {
            setCurrentIndex(video_id);
          }
          if (entry.isIntersecting && previousIndex) {
            previousIndex.current = currIndex;
          }
          if (entry.isIntersecting) {
            if (
              totalLoadedVideoCount &&
              currIndex &&
              !listUpdated.current &&
              totalLoadedVideoCount - 4 == currIndex
            ) {
              loadNextVideos();

              listUpdated.current = true;
              console.log("updated" + listUpdated.current);
            }
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
    },
    [url, loading]
  );

  useEffect(
    () => {
      if (
        previousIndex &&
        previousIndex.current > 5 &&
        currIndex < previousIndex.current - 5 &&
        !!videoRef.current &&
        !!hlsInstanceRef.current
      ) {
        console.log("error at index");
        hlsInstanceRef.current.detachMedia(); // Detach media from HLS instance
        hlsInstanceRef.current.destroy(); // Destroy HLS instance
        hlsInstanceRef.current = null; // Reset HLS instance reference
        // Remove video element from DOM
        videoRef.current = "";
      }
    },
    [previousIndex && previousIndex.current]
  );

  useEffect(
    () => {
      if (!mutedRef.current && !!videoRef.current) {
        videoRef.current.muted = false;
      }
    },
    [mutedRef.current]
  );

  useEffect(
    () => {
      if (!!videoRef.current) {
        videoRef.current.muted = mutedRef.current;
      }
    },
    [videoRef.current]
  );

  return (
    <div style={{ width: "337px" }} className="video">
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)"
          }}
        >
          <Oval
            height="40"
            width="40"
            color="#ffffff"
            ariaLabel="loading-spinner"
          />
        </div>
      )}
      <video
        onClick={onVideoPress}
        className="player"
        muted={mutedRef.current}
        ref={videoRef}
        loop
        playsInline
      />
      <div className="bottom-controls">
        <div className="footer-left">
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
