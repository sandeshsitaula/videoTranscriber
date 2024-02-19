import {useState,useEffect,useRef} from 'react'
import axiosInstance from '../axiosInstance'
import Video from './Video'
import {useParams,Link} from 'react-router-dom'

export const CutVideoList = () => {
    const { video_id } = useParams();
    const [cutVideoList, setCutVideoList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevScrollY, setPrevScrollY] = useState(0);

    useEffect(() => {
        async function getVideos() {
            try {
                const response = await axiosInstance.get(`getcutvideos/${video_id}/`);
                setCutVideoList(response.data.data);
            } catch (error) {
                console.log(error);
            }
        }

        getVideos();
    }, [video_id]);

    useEffect(() => {
        const handleScroll = () => {

            const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
            const deltaY = currentScrollY - prevScrollY;

            // Define a threshold to trigger content change
            // Change index based on scroll direction
            if (deltaY > 0) {
                setCurrentIndex(prevIndex => Math.min(prevIndex + 1, cutVideoList.length - 1)); // Increment index
            } else if (deltaY < 0) {
                setCurrentIndex(prevIndex => Math.max(prevIndex - 1, 0)); // Decrement index
            }

            setPrevScrollY(currentScrollY);
        };

        const debouncedHandleScroll = debounce(handleScroll, 100);

        // Attach the debounced scroll event listener
        window.addEventListener('scroll', debouncedHandleScroll);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', debouncedHandleScroll);
        };
    }, [prevScrollY, cutVideoList]);
 // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    return (
        <div>
            {cutVideoList.length !== 0 ? (
                <Video
                    key={cutVideoList[currentIndex].cut_video_id}
                    url={`http://meet.fractalnetworks.co:80/${cutVideoList[currentIndex].cut_video_path}`}
                    song="demo song"
                    description="demo testing purposes"
                    channel="demo channel"
                    likes={100}
                    messages="demo"
                    shares={100}
                />
            ) : (
                "No Videos to Load"
            )}
        </div>
    );
};

