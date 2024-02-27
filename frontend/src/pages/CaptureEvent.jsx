import { useState, useEffect, useRef } from "react";
import { Button, FormControl } from "react-bootstrap";
export function CaptureEvent(props) {
  const [eventName, setEventName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [intialState, setIntialState] = useState(true);
  const [frontMediaRecorder, setFrontMediaRecorder] = useState(null);
  const [backMediaRecorder, setBackMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isIOS, setIsIOS] = useState(false);
  const [facingMode,setFacingMode]=useState('user')
  const [backCameraExists, setBackCameraExists] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
if (userAgent.includes('android')){
        setBackCameraExists(true);
}
    else if(userAgent.includes('iphone')||userAgent.includes('ipad')){
      alert(userAgent)
      setISIOS(true)
      setBackCameraExists(true);
  }else{
    setBackCameraExists(false)
  }

  }, []);


  async function recordingLogic(facingMode) {
    const constraints = {
      video: {
        facingMode: facingMode, // 'user' for front camera, 'environment' for back camera
      },
      audio: true,
    };
    const mergedStream = await navigator.mediaDevices.getUserMedia(constraints);
    videoRef.current.srcObject = mergedStream;
    // Capture audio from the surrounding environment
    return mergedStream;
  }


 async function startIntialCamera(facingMode) {
    try {
      alert("inintialstartrecording", facingMode);
         const mergedStream = await recordingLogic(facingMode);
setIntialState(true)
if (!mergedStream) {
    console.error('Failed to obtain a valid media stream');
    return;
}
      console.log(mergedStream)
      if (MediaRecorder.isTypeSupported("video/webm; codecs=vp9")) {
      var options = { mimeType: "video/webm; codecs=vp9", videoBitsPerSecond:8000000 };
    } else if (MediaRecorder.isTypeSupported("video/webm")) {
      var options = { mimeType: "video/webm",videoBitsPerSecond:8000000 };
    } else if (MediaRecorder.isTypeSupported("video/mp4")) {
      var options = { mimeType: "video/mp4", videoBitsPerSecond: 8000000 };
    } else {
      alert("no suitable mimetype found for this device");
      console.error("no suitable mimetype found for this device");
    }
      const recorder = new MediaRecorder(mergedStream, options);
      recorder.start();
      if (facingMode == "user") {
        setFrontMediaRecorder(recorder);
      } else {
        setBackMediaRecorder(recorder);
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }
   useEffect(() => {
     console.log("calling startintial acmera");
     if (intialState){
     startIntialCamera("user");
     }
   }, []);

  const startNewRecording = () => {
    setRecordedChunks([]);
    stopRecording();
    setIntialState(false);
    startRecording(facingMode);
  };

  const startRecording = async (facingMode = "user") => {
    try {
      alert("instartrecording", facingMode);
      const mergedStream = await recordingLogic(facingMode);

if (!mergedStream) {
    console.error('Failed to obtain a valid media stream');
    return;
}
          if (MediaRecorder.isTypeSupported("video/webm; codecs=vp9")) {
      var options = { mimeType: "video/webm; codecs=vp9" };
    } else if (MediaRecorder.isTypeSupported("video/webm")) {
      var options = { mimeType: "video/webm" };
    } else if (MediaRecorder.isTypeSupported("video/mp4")) {
      var options = { mimeType: "video/mp4", videoBitsPerSecond: 100000 };
    } else {
      alert("no suitable mimetype found for this device");
      console.error("no suitable mimetype found for this device");
    }
      const recorder = new MediaRecorder(mergedStream, options);
      recorder.ondataavailable = handleDataAvailable;
      recorder.start();
      if (facingMode == "user") {
        setFrontMediaRecorder(recorder);
      } else {
        setBackMediaRecorder(recorder);
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const stopRecording = () => {
    console.log(recordedChunks)
    if (frontMediaRecorder) {
      frontMediaRecorder.stop();
      setFrontMediaRecorder(null);
    }
    if (backMediaRecorder) {
      backMediaRecorder.stop();
      setBackMediaRecorder(null);
    }
    if (videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop()); // Stop tracks associated with the back camera
      videoRef.current.srcObject = null; // Reset srcObject
    }

  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
    }
  };

  function handleEventNameChange(e) {
    setEventName(e.target.value);
  }
  async function handleUpload() {
//     if (frontMediaRecorder || backMediaRecorder) {
//       alert("Recording in progress");
//       return;
//     }
    if (recordedChunks.length == 0) {
      alert("Nothing to Upload.Record something first");
      return;
    }
    if (eventName == "") {
      alert("write some event name");
      return;
    }
    try {
      setUploading(true);
      var response;
      if (isIOS) {
        response = await props.handleFileUpload(recordedChunks, eventName);
        console.log(response);
        console.log(response.data.data);
      } else {
        alert(recordedChunks);
        console.log(recordedChunks);
        response = await props.handleFileUpload(recordedChunks, "", eventName);
        console.log(response);
        console.log(response.data.data);
      }

      alert("sucessfully uploaded");
    } catch (error) {
      alert(error.error);
      console.error("Error uploading chunk:", error);
    } finally {
      console.log("finally done");
      setUploading(false);
    }
  }

  const swapCamera = () => {
    if (frontMediaRecorder) {
      stopRecording();
      setFacingMode('environment')
      alert("changing to env");
      if (intialState) {
        console.log("in intial state");
        startIntialCamera("environment");
      } else {
        startRecording("environment");
      }
    }
    if (backMediaRecorder) {
      setFacingMode('user')
      stopRecording();
      alert("changing to user");
      if (intialState) {
        startIntialCamera("user");
      } else {
        startRecording("user");
      }
    }
    // Start recording with the updated facing mode
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          backgroundColor: "#282828",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <video
          muted={true}
          style={{ height: "80vh", marginBottom: "1rem" }}
          ref={videoRef}
          playsInline
          autoPlay
        />
        <div>
      {(!frontMediaRecorder&&!backMediaRecorder)&&  <Button style={{marginRight:'1rem'}} onClick={startIntialCamera}>
        Start Camera
        </Button>}

          <Button style={{ marginRight: "1rem" }} onClick={startNewRecording}>
            Start New Recording
          </Button>

         <Button style={{ marginRight: "1rem"}} onClick={stopRecording}>
            Stop Recording
          </Button>

          {(frontMediaRecorder || backMediaRecorder) && backCameraExists && (
            <Button style={{marginTop:'1rem'}} onClick={swapCamera}>Swap Camera</Button>
          )}

          <br />
          <br />
          <FormControl
            placeholder="EventName"
            name="eventName"
            type="text"
            onChange={(e) => handleEventNameChange(e)}
            value={eventName}
          />
          <br />
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading" : "Upload Video"}
          </Button>
        </div>
      </div>
    </>
  );
}
