import {useState,useEffect,useRef} from 'react'
import {Button,FormControl} from 'react-bootstrap'
export function CaptureEvent(props){
  const [eventName,setEventName]=useState('')
  const [uploading,setUploading]=useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const videoRef = useRef(null);

  const startRecording = async () => {
    try {

  setRecordedChunks([])
// Capture video from the screen without audio
  const videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });

      videoRef.current.srcObject = videoStream;
  // Capture audio from the surrounding environment
  const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // Combine video and audio streams
  const mergedStream = new MediaStream([
    ...videoStream.getVideoTracks(),
    ...audioStream.getAudioTracks()
  ]);
  const recorder = new MediaRecorder(mergedStream, { mimeType: 'video/webm' });
      recorder.ondataavailable = handleDataAvailable;
      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

const stopRecording = () => {
  setMediaRecorder((prevRecorder) => {
    if (prevRecorder) {
      prevRecorder.stop();
    const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    return null; // Set mediaRecorder to null
  });
  console.log("Recording stopped");
};

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedChunks(prevChunks => [...prevChunks, event.data]);
    }
  };
function handleEventNameChange(e){
  setEventName(e.target.value)
}
  async function handleUpload(){
    if (mediaRecorder){
      alert("Recording in progress")
      return
    }
    if (recordedChunks.length==0){
      alert("Nothing to Upload.Record something first")
      return
    }
    if (eventName==""){
      alert("write some event name")
      return
    }
    try{
      setUploading(true)
    const response=await props.handleFileUpload(recordedChunks[0],"",eventName)
    console.log(response.data.data)
    alert("sucessfully uploaded")
    } catch (error) {
      alert(error.error);
      console.error("Error uploading chunk:", error);
    } finally {
      console.log("finally done")
      setUploading(false);
    }

  }
return(
    <>
    <div
style={{display:'flex',backgroundColor:"#282828",flexDirection:'column',alignItems:
'center' } } >
    <video style={{height:'80vh',marginBottom:'1rem'}} ref={videoRef} playsinline autoPlay />
    <div>
      <Button style={{marginRight:'1rem'}} onClick={startRecording}>Start
Recording</Button>
      <Button onClick={stopRecording}>Stop Recording</Button>
      <br />
      <br />
      <FormControl placeholder="EventName" name="eventName" type="text" onChange={(e)=>handleEventNameChange(e)} value={eventName} />
      <br />
      <Button onClick={handleUpload} disabled={uploading}>{uploading?"Uploading":"Upload Video"}</Button>
      </div>

    </div>
    </>
)
}
