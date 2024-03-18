import React, { useState } from "react";

import { FaHeart } from "react-icons/fa";
import { FaCommentDots } from "react-icons/fa";
import { FaShare } from "react-icons/fa";
import "./css/SideBar.css";
function VideoSidebar({ comments, shares, likes }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="videoSidebar">
      <div className="videoSidebar__button">
        {liked ? (
          <FaHeart
            style={{ color: "skyblue", marginLeft: "5px", fontSize: "2rem" }}
            onClick={e => setLiked(false)}
          />
        ) : (
          <FaHeart
            style={{ color: "white", marginLeft: "5px", fontSize: "2rem" }}
            fontSize="large"
            onClick={e => setLiked(true)}
          />
        )}
        <p>{liked ? `${likes + 1}` : `${likes}`}</p>
      </div>
      <div className="videoSidebar__button">
        <FaCommentDots
          style={{ color: "white", fontSize: "2rem", marginLeft: "5px" }}
        />
        <p>{comments}</p>
      </div>
      <div className="videoSidebar__button">
        <FaShare
          style={{ color: "white", fontSize: "2rem", marginLeft: "5px" }}
        />
        <p>{shares}</p>
      </div>
    </div>
  );
}
export default VideoSidebar;
