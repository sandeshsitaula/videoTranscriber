import React, { useRef, useState ,useEffect} from 'react';
import './css/Video.css';
import VideoFooter from "./VideoFooter"
import axiosInstance from '../../axiosInstance'
import Hls from 'hls.js';

import VideoSidebar from './VideoSidebar';
function Video({url, song, description, cut_video_id,video_id,channel, likes, comments, shares}) {
const [playing, setPlaying] = useState(true);
    const videoRef = useRef(null);
      const [hls, setHls] = useState(null);

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
            threshold: 0.1// Adjust threshold as needed
        };

        const handleIntersection = async (entries) => {
            entries.forEach(async(entry) => {
                if (entry.isIntersecting) {
                    console.log("intersecting")
                    // Load video content when it comes into view
                    if (!videoElement.src){
                      const response=await  axiosInstance.get(`streamcutvideo/${cut_video_id}`)
                  function loadNextStream(){
                     const newHls = new Hls();
                    newHls.loadSource(url);
                    newHls.attachMedia(videoRef.current);
                    newHls.on(Hls.Events.ERROR, function(event, data) {
                    if (data.fatal) {
                        console.log(data)
                    }
                    })
                setHls(newHls);
                    }
                      if (Hls.isSupported() && !hls) {
                            console.log("supported")
                              loadNextStream()

                            // loadNextStream();
                    } else if (!Hls.isSupported() &&
                      videoRef.current.canPlayType('application/vnd.apple.mpegurl') && !hls) {
                        console.log('couldnot play')
                    }
                    videoRef.current.currentTime = 0; // Set the current time to 0
                    }
                     videoRef.current.play();
                    setPlaying(true)
                } else {

                        if (videoElement.src){
                          console.log(videoRef.current)
                            videoRef.current.pause()
                            setPlaying(false)
                    }
                    // Unload video content when it goes out of view
//                     videoElement.src = '';
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


