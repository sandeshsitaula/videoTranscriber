// UploadForm.js
import  { useState } from 'react';
import axiosInstance from '../axiosInstance'
const CHUNK_SIZE = 10 * 1024 * 1024; // 1MB chunk size

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [videoName,setVideoName]=useState('')
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
      console.log('Upload complete');
    } catch (error) {
      console.error('Error uploading chunk:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Submit'}
      </button>
    </div>
  );
};

export default UploadForm;
