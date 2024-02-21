import React, { useRef, useState ,useEffect} from 'react';
import './css/Video.css';
import VideoFooter from "./VideoFooter"
import axiosInstance from '../../axiosInstance'
import Hls from 'hls.js';

import VideoSidebar from './VideoSidebar';
function Video({mutedRef,url, song, description, cut_video_id,video_id,channel, likes, comments, shares}) {
const [playing, setPlaying] = useState(false);
    const videoRef = useRef(null);
//       const mutedRef = useRef(true); // Assuming initially muted
    const hlsLoaded = useRef(false);

    const onVideoPress = () => {
    if (mutedRef.current) {
      mutedRef.current = false; // If currently muted, unmute it
      videoRef.current.muted = false;
    }
        if(playing) {
            videoRef.current.pause();
            setPlaying(false)
        } else {
            videoRef.current.play();
            setPlaying(true)
        }
    }

      useEffect(() => {
        const videoElement = videoRef.current;

        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2// Adjust threshold as needed
        };

        const handleIntersection = async (entries) => {
            entries.forEach(async(entry) => {
                if (entry.isIntersecting) {
                    // Load video content when it comes into view
                        if (hlsLoaded.current) {
                         videoRef.current.play();
                    setPlaying(true)
                        return;
                        }

                     const response = await axiosInstance.get(`streamcutvideo/${cut_video_id}`);

                    const newHls = new Hls();
                    newHls.loadSource(url);
                    newHls.attachMedia(videoRef.current);
                    hlsLoaded.current = true;
//                             videoRef.current.play(); // Start playing the video immediately after attaching HLS instance
//                             setPlaying(true);
                            console.log(newHls);
                } else {
                        videoRef.current.pause()
                        setPlaying(false)
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

      useEffect(()=>{
        console.log(mutedRef.current)
      videoRef.current.muted = false;
    },[mutedRef.current])


    return (
        <div className="video">
            <video className="player" ref={videoRef} onClick={onVideoPress} playsInline autoPlay={true} muted={mutedRef.current} ></video>
            <VideoSidebar comments={comments} shares={shares} likes={likes}/>

              <div className="bottom-controls">
        <div className="footer-left">
          {/* The left part of the container */}
          <VideoFooter channel={channel} description={description}song={song} />

        </div>
            <VideoSidebar comments={comments} shares={shares} likes={likes}/>

      </div>

        </div>
    )
}
export default Video


