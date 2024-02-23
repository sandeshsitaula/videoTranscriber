import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { OriginalVideoList } from "./pages/OriginalVideoList";
import {CaptureEvent} from './pages/CaptureEvent'
import { CutVideoList } from "./pages/CutVideoList";
import Video from "./components/videoPlayer/Video";
import UploadForm from "./components/cutVideo/UploadForm";
import {PlayOriginalVideo} from './components/videoPlayer/PlayOriginalVideo';
import { handleFileUpload } from "./utils/handleFileUpload";
function App() {

  return (
    <>
      {
        <Router>
          <Routes>
            <Route path="/" element={<OriginalVideoList />} />
            <Route path="/video" element={<Video />} />
            <Route
              path="/cutvideo"
              element={<UploadForm handleFileUpload={handleFileUpload} />}
            />
            <Route path="/cutvideolist/:video_id" element={<CutVideoList />} />
            <Route path="/playvideo/:video_id/:video_name"
element={<PlayOriginalVideo />} />
            <Route path="/captureevent" element={<CaptureEvent handleFileUpload={handleFileUpload} />}/>
          </Routes>
        </Router>
      }
    </>
  );
}

export default App;
