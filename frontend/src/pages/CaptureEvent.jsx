import {useState,useEffect,useRef} from 'react'
import {Button,FormControl} from 'react-bootstrap'
export function CaptureEvent(props){
  const [eventName,setEventName]=useState('')
  const [uploading,setUploading]=useState(false)
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [facingMode,setFacingMode]=useState('user')
  const [isIOS, setIsIOS] = useState(false);
  const [backCameraExists,setBackCameraExists]=useState(true)
  const videoRef = useRef(null);
  useEffect(() => {

    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(userAgent.includes('iphone') || userAgent.includes('ipad'));
    async function cameraChecker(){
    // Enumerate devices to find the back camera
    const devices = await navigator.mediaDevices.enumerateDevices();
    const backCamera = devices.find(device => device.kind === 'videoinput' && device.label.toLowerCase().includes('back'));

    if (!backCamera) {
     setBackCameraExists(false)
     console.log("no back camera")
      return;
    }}
    cameraChecker()
  }, []);



  const startRecording = async () => {
    try {
  setRecordedChunks([])
// Capture video from the screen without audio
      // Specify the desired camera using the facingMode constraint
    const constraints = {
      video: {
        facingMode: facingMode // 'user' for front camera, 'environment' for back camera
      },
      audio: true
    };
  const mergedStream = await navigator.mediaDevices.getUserMedia( constraints);

      videoRef.current.srcObject = mergedStream;
  // Capture audio from the surrounding environment


      if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9')) {
    var options = {mimeType: 'video/webm; codecs=vp9'};
    } else  if (MediaRecorder.isTypeSupported('video/webm')) {
      var options = {mimeType: 'video/webm'};
    } else if (MediaRecorder.isTypeSupported('video/mp4')) {
    var options = {mimeType: 'video/mp4', videoBitsPerSecond : 100000};
    } else {
      alert("no suitable mimetype found for this device")
    console.error("no suitable mimetype found for this device");
}

      const recorder = new MediaRecorder(mergedStream, options);
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
  alert("recording stopped")
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
      var response
      if (isIOS){
     response=await props.handleFileUpload(recordedChunks[0],eventName)
      }else{
     response=await props.handleFileUpload(recordedChunks[0],"",eventName)
      }

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
 const swapCamera = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };
return(
    <>
    <div
style={{display:'flex',backgroundColor:"#282828",flexDirection:'column',alignItems:
'center' } } >
    <video muted={true} style={{height:'80vh',marginBottom:'1rem'}} ref={videoRef} playsInline autoPlay />
    <div>
      <Button style={{marginRight:'1rem'}} onClick={startRecording}>StartRecording</Button>
      <Button style={{marginRight:'1rem'}} onClick={stopRecording}>Stop Recording</Button>
      {mediaRecorder && backCameraExists && <Button onClick={swapCamera}>Swap Camera</Button>}

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
