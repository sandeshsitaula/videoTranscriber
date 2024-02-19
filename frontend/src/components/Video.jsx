import React, { useRef, useState ,useEffect} from 'react';
import './Video.css';
import VideoFooter from "./VideoFooter"
import VideoSidebar from './VideoSidebar';
function Video({url, song, description, channel, likes, messages, shares}) {
const [playing, setPlaying] = useState(true);
    const videoRef = useRef(null);
    const onVideoPress = () => {
        console.log(playing)
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
            threshold: 0.3// Adjust threshold as needed
        };

        const handleIntersection = (entries) => {
            entries.forEach(entry => {
                console.log(entry)
                if (entry.isIntersecting) {
                    console.log(videoElement,url)
                    // Load video content when it comes into view
                    videoElement.src = url;
                        videoElement.addEventListener('loadedmetadata', () => {
                            // Ensure that the video is still paused before attempting to play
                            if (videoElement.paused) {
                                videoElement.play().catch(error => {
                                    console.log("Autoplay failed: ", error);
                                    setPlaying(false)
                                });
                            }
                    })
                } else {
                        if (videoElement.src){
                        console.log('stop')
                            videoElement.pause()
                            setPlaying(false)
                    }
                    // Unload video content when it goes out of view
                    videoElement.src = '';

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
            <VideoSidebar messages={messages} shares={shares} likes={likes}/>
        </div>
    )
}
export default Video
