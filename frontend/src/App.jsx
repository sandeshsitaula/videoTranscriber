import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {OriginalVideoList} from './components/OriginalVideoList'
// import UploadForm from './components/UploadForm'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      {/*  <UploadForm />*/}
      <OriginalVideoList />
        </div>
    </>
  )
}

export default App
