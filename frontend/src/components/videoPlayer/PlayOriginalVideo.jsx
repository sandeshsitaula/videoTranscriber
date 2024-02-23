import { useState, useEffect, useRef } from "react";
import Video from "./Video";
import { useParams, Link } from "react-router-dom";
import "../../pages/css/CutVideo.css";
export const PlayOriginalVideo = () => {
  const mutedRef = useRef(true);
  const { video_id } = useParams();
    const {video_name}=useParams();

   var comments = 100;
                var likes = 100;
                var shares = 100;
                var description = "demo testing purposes description";
                var channel = "demo channel";
                var song = "demo song";
                var url =`https://app.meet.fractalnetworks.co/hls/playlist_${video_name}.m3u8`;

  return (
    <>
      <div className="app">
        <div className="containers">
                  <Video
                    comments={comments}
                    video_id={video_id}
                    mutedRef={mutedRef}
                    likes={likes}
                    shares={shares}
                    description={description}
                    channel={channel}
                    song={song}
                    url={url}
                    type="original"
                  />

        </div>
      </div>
    </>
  );
};
