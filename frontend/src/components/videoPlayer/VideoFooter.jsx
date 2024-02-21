import React from "react";
import "./css/VideoFooter.css";
// import MusicNoteIcon from '@material-ui/icons/MusicNote';
// import Ticker from 'react-ticker'
import { FaMusic } from "react-icons/fa";
function VideoFooter({ channel, description, song }) {
  return (
    <div className="footer-container">
      <div className="footer-left">
        <div className="text">
          <h3>@{channel}</h3>
          <p>{description}</p>
          <div className="ticker">
            <FaMusic style={{ fontSize: "2rem", marginRight: "1rem" }} />

            {/* eslint-disable-next-line jsx-a11y/no-distracting-elements */}
            <marquee direction="left" scrollamount="2">
              <span>{song}</span>
            </marquee>
          </div>
        </div>
      </div>
    </div>
  );
}
export default VideoFooter;
