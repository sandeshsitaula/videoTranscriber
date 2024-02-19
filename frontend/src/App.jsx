import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {OriginalVideoList} from './pages/OriginalVideoList'
import {CutVideoList} from './components/CutVideoList'
import Video from './components/Video'
// import UploadForm from './components/UploadForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      { <Router>
        <Routes>
          <Route path="/" element={<OriginalVideoList />} />
          <Route path="/video" element={<Video />} />
          <Route path="/cutvideolist/:video_id" element={<CutVideoList />} />
        </Routes>
      </Router>  }
      </>
  )
}

export default App
