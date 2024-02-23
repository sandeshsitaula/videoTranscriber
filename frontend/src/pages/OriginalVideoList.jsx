import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { Link } from "react-router-dom";
import {Button} from 'react-bootstrap'
export const OriginalVideoList = () => {
  const [videoList, setVideoList] = useState(null);
  useEffect(() => {
    async function getVideos() {
      try {
        const response = await axiosInstance.get("getallvideos/");
        setVideoList(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    getVideos();
  }, []);

  return (
    <>
      <h3>All Videos</h3>
      {videoList &&
        videoList.map((video) => {
          var video_name = video.video_path.split("/")[2];
          var video_name_without_ext=video_name.split('.')[0]
          return (
            <div key={video.video_id} style={{ cursor: "pointer",
                  color: "white",
                  backgroundColor: "gray",
                  marginTop: "1rem",
                  display:'flex',
                  justifyContent:'space-between',
                  padding: "1rem",}}>
            <Link key={video.video_id} to={`/cutvideolist/${video.video_id}`}>
              <div style={{color:'white'}}>
                {video_name}
              </div>
            </Link>

           <Link to ={`/playvideo/${video.video_id}/${video_name_without_ext}`}>
           <Button variant="danger">Play Video</Button>
           </Link>
            </div>

          );
        })}
    </>
  );
};
