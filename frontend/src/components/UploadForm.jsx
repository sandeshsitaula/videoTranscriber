// UploadForm.js
import  { useState ,useEffect} from 'react';
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
  const [originalVideoName,setOrignalVideoName]=useState('')
  const [cutVideoName,setCutVideoName]=useState('')
  const [loading,setLoading]=useState(false)


  useEffect(()=>{
    console.log(originalVideoName,cutVideoName)
  })
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

         response=await axiosInstance.post('videoupload/',formData ) ;

        chunkNumber++;
        start = end;
        end = Math.min(start + CHUNK_SIZE, file.size);
      }

//       console.log(response.data)
      setSubtitleData(response.data.data)
      console.log('Upload complete');
    } catch (error) {
      alert(error.error)
      console.error('Error uploading chunk:', error);
    } finally {
      setUploading(false);
    }
  };

   const handleFileDownload=async(target)=>{
    if (loading){
      alert("In progress.Wait a while")
      return
    }
    setLoading(true)
    try{
    const postData={
         'filename':target
      }
      const response =await axiosInstance.post('filedownload/',postData,{
        responseType:'blob'
      })
          // Create a blob object from the response data
    const blob = new Blob([response.data], { type: 'application/octet-stream'
});

    // Create a temporary anchor element to trigger the download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', target); // Set the download attribute tothe filename
    document.body.appendChild(link);
    // Trigger the download
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
      console.log(response.data)
      setLoading(false);
    } catch (error) {
      console.log(error)
      setLoading(false);
      if (error.response){
        alert(error.response.data.message)
      }else{
        alert(error)
      }
  }
   }
  return (
    <>
    {showModal && <CutVideoModal videoName={videoName}
subtitleToCut={subtitleToCut} setSubtitleToCut={setSubtitleToCut}
setModal={setShowModal} setOriginalVideoName={setOrignalVideoName}
setCutVideoName={setCutVideoName} />}

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
{originalVideoName.length>0 && cutVideoName.length>0 &&  <div
style={{display:'flex',marginTop:'2rem',justifyContent:'center'}}>
     <Button variant="primary" disabled={loading}
onClick={()=>handleFileDownload(originalVideoName)}>Download Original
Video</Button>
 <Button  style={{marginLeft:'2rem'}}variant="primary" disabled={loading}
onClick={()=>handleFileDownload(cutVideoName)}>Download Cut
Video</Button>
    </div>
}
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
