import React, { useRef, useState ,useEffect} from 'react';
import './css/Video.css';
import VideoFooter from "./VideoFooter"
import axiosInstance from '../../axiosInstance'
import Hls from 'hls.js';

import VideoSidebar from './VideoSidebar';
function Video({url, song, description, cut_video_id,video_id,channel, likes, comments, shares}) {
const [playing, setPlaying] = useState(true);
    const videoRef = useRef(null);
    const hlsLoaded = useRef(false);

    const onVideoPress = () => {
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
            threshold: 0.5// Adjust threshold as needed
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
                            videoRef.current.play(); // Start playing the video immediately after attaching HLS instance
                            setPlaying(true);
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



    return (
        <div className="video snap-always snap-center">
            <video className="video__player" ref={videoRef} onClick={onVideoPress} ></video>
          <VideoFooter channel={channel} description={description} song={song}/>
            <VideoSidebar comments={comments} shares={shares} likes={likes}/>
        </div>
    )
}
export default Video


