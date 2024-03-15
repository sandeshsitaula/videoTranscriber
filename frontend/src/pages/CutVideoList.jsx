import { useState, useEffect, useRef } from "react";
import axiosInstance from "../axiosInstance";
import Video from "../components/videoPlayer/Video";
import { useParams, Link } from "react-router-dom";
import "./css/CutVideo.css";
export const CutVideoList = () => {
  const mutedRef = useRef(true);
  const { video_id } = useParams();
  const [cutVideoList, setCutVideoList] = useState([]);
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
  }, []);

  return (
    <>
      <div className="app">
        <div className="containers">
          {cutVideoList.length != 0
            ? cutVideoList.map(video => {
                var comments = 100;
                var likes = 100;
                var shares = 100;
                var description = "demo testing purposes description";
                var channel = "demo channel";
                var song = "demo song";
                var cut_video_id = video.cut_video_id;
                var video_name = video.cut_video_path.split("/")[2];
                var video_ids_list = video_name.split("_");
                var video_id = video_ids_list[video_ids_list.length - 2];
                var url = `https://app01.test.fractalnetworks.co/hls/playlist_${video_id}.m3u8`;
                var lastId = cutVideoList[0].cut_video_id;

                return (
                  <div style={{ height: "100%" }}>
                    <Video
                      key={video.cut_video_id}
                      comments={comments}
                      video_id={cut_video_id}
                      mutedRef={mutedRef}
                      likes={likes}
                      shares={shares}
                      description={description}
                      channel={channel}
                      song={song}
                      type="cut"
                      url={url}
                      lastId={lastId}
                    />
                  </div>
                );
              })
            : "No Videos to Load"}
        </div>
      </div>
    </>
  );
};
