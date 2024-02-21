import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { Link } from "react-router-dom";
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
          return (
            <Link key={video.video_id} to={`/cutvideolist/${video.video_id}`}>
              <div
                style={{
                  cursor: "pointer",
                  color: "white",
                  backgroundColor: "gray",
                  marginTop: "1rem",
                  padding: "1rem",
                }}
              >
                {video_name}
              </div>
            </Link>
          );
        })}
    </>
  );
};
