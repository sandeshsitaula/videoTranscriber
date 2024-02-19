import React from 'react';
import "./css/VideoFooter.css"
// import MusicNoteIcon from '@material-ui/icons/MusicNote';
// import Ticker from 'react-ticker'
import { FaMusic } from "react-icons/fa";
function VideoFooter({channel, description, song}) {
    return (
        <div className="videoFooter">
            <div className="videoFooter_text">
                <h3>@{channel}</h3>
                <p>{description}</p>
                <div style={{textAlign:'center',display:'flex',marginBottom:'1rem'}}>
                <FaMusic style={{fontSize:'2rem',marginRight:'1rem'}}/>

                                <p>{song}</p>

                </div>
            </div>
            <img className="videoFooter_record"
src="https://static.thenounproject.com/png/934821-200.png" alt=""/>
        </div>
    )
}
export default VideoFooter;
