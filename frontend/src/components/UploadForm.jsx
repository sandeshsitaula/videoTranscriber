// UploadForm.js
import  { useState } from 'react';
import {Button} from 'react-bootstrap'
import axiosInstance from '../axiosInstance'
import {CutVideoModal} from './CutVideoModal'

const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunk size

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [videoName,setVideoName]=useState('')
  const [subtitleData,setSubtitleData]=useState('')
  const [showModal,setShowModal]=useState(false)
  const [subtitleToCut,setSubtitleToCut]=useState('')

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    var tempVideoName=event.target.files[0].name.split('.').slice(0,-1).join(".")
    console.log(tempVideoName)
    setVideoName(tempVideoName)
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      var start = 0;
      var end = Math.min(CHUNK_SIZE, file.size);
      let chunkNumber = 0;
      let response
      while (start < file.size) {
        const formData = new FormData();
        formData.append('video', file.slice(start, end));
        formData.append('videoName', videoName);

        // Add metadata to identify the chunk
        formData.append('chunkNumber', chunkNumber);
        formData.append('totalChunks', Math.ceil(file.size / CHUNK_SIZE));

         response=await
axiosInstance.post('videoupload/',
formData ) ;

        chunkNumber++;
        start = end;
        end = Math.min(start + CHUNK_SIZE, file.size);
      }

      console.log(response.data)
      setSubtitleData(response.data.data)
      console.log('Upload complete');
    } catch (error) {
      alert(error.error)
      console.error('Error uploading chunk:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
    {showModal && <CutVideoModal videoName={videoName}
subtitleToCut={subtitleToCut} setSubtitleToCut={setSubtitleToCut}
setModal={setShowModal} />}

    <div style={{backgroundColor:'#242424'}}>
    <div style={{color:'white'}}
className="fileUpload">
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Submit'}
      </button>
    </div>
    {subtitleData &&<div style={{marginTop:'5rem',color:'white'}}
className="subtitleText">
    <div style={{textAlign:'center'}}>
      <Button variant="primary" onClick={()=>setShowModal(true)}>Cut
Video</Button>
    </div>

    <h4>Generated Subtitles</h4>

    <p style={{marginTop:'2rem'}}>
    {subtitleData}
    </p>

    </div>}
    </div>
    </>
  );
};

export default UploadForm;
