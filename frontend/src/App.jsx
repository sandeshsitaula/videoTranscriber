import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UploadForm from './components/UploadForm'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <UploadForm />
        </div>
    </>
  )
}

export default App
