import { useState, useEffect, useRef } from "react";
import { Button, FormControl } from "react-bootstrap";
import { PiRecordFill } from "react-icons/pi";
import { FaRecordVinyl } from "react-icons/fa6";
import { MdDone } from "react-icons/md";
import './css/CaptureEvent.css'
import CameraSwitch from '../assets/cameraswitch.svg';
export function CaptureEvent(props) {
  const [eventName, setEventName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [intialState, setIntialState] = useState(true);
  const [frontMediaRecorder, setFrontMediaRecorder] = useState(null);
  const [backMediaRecorder, setBackMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isIOS, setIsIOS] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const [backCameraExists, setBackCameraExists] = useState(true);
  const [time,setTime]=useState('')
  const videoRef = useRef(null);
  const recorderRef=useRef(null)
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes("android")) {
      setBackCameraExists(true);
    } else if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
      setIsIOS(true);
      setBackCameraExists(true);
    } else {
      setBackCameraExists(false);
    }
  }, []);

  async function recordingLogic(facingMode) {
    alert('recordinglogic'+facingMode)
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
useEffect(()=>{
  console.log(recorderRef.current)
  console.log(recordedChunks)
})
  async function startIntialCamera(facingMode) {
    try {
      const mergedStream = await recordingLogic(facingMode);
      if (!mergedStream) {
        console.error("Failed to obtain a valid media stream");
        return;
      }
      if (MediaRecorder.isTypeSupported("video/webm; codecs=vp9")) {
        var options = {
          mimeType: "video/webm; codecs=vp9",
          videoBitsPerSecond: 8000000,
        };
      } else if (MediaRecorder.isTypeSupported("video/webm")) {
        var options = { mimeType: "video/webm", videoBitsPerSecond: 8000000 };
      } else if (MediaRecorder.isTypeSupported("video/mp4")) {
        var options = { mimeType: "video/mp4", videoBitsPerSecond: 8000000 };
      } else {
        alert("no suitable mimetype found for this device");
        console.error("no suitable mimetype found for this device");
      }
      const recorder = new MediaRecorder(mergedStream, options);
      if (facingMode == "user") {
        setFrontMediaRecorder(recorder);

      } else {
        setBackMediaRecorder(recorder);
      }
      recorderRef.current=recorder
      console.log(recorderRef.current)
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }
  useEffect(() => {
    console.log("calling startintial acmera");
    if (intialState) {
      startIntialCamera("user");
    }
  }, []);

  const startNewRecording = async(swap=false,facingMode=facingMode) => {
   alert('in startnew recording'+swap)
    if (swap){
      alert('in intial mode')
     await startIntialCamera(facingMode)
    }else{
      alert("in swap mode")
    setRecordedChunks([]);

    }

    setIntialState(false);
    startRecording(facingMode);
  };


  const startRecording = async (facingMode = "user") => {
    try {
      alert("inside sttart recording"+facingMode+intialState)
      console.log("inside start recording"+facingMode+intialState)


    //  if (facingMode=='user'){
    //     recorder=frontMediaRecorder
    // }else{
    //   recorder=backMediaRecorder
    // }
    alert(recorderRef.current)
    recorderRef.current.start()
      recorderRef.current.ondataavailable = handleDataAvailable;
      console.log(recorderRef.current)
//     console.log(recorder)
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

const stopRecording = (swap = false) => {
  console.log(recordedChunks)

  if (swap) {
    recorderRef.current.stop()
     recorderRef.current=null;
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
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  } else {
    recorderRef.current.stop()
    setIntialState(true);
    // Stop recording process without resetting any state
    if (frontMediaRecorder) {
      frontMediaRecorder.stop()
//       frontMediaRecorder.ondataavailable=null
    }
    if (backMediaRecorder) {
      backMediaRecorder.stop()
//       backMediaRecorder.ondataavailable=null
    }
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
    var eventName=prompt("Enter event name")
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
      } else {
        response = await props.handleFileUpload(recordedChunks, "", eventName);
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
      setFacingMode("environment");
      stopRecording(true);
      if (intialState) {
        startIntialCamera("environment");
        return
      } else {
        alert("not intial state")
        startNewRecording(true,'environment');
        return
      }
    }
    if (backMediaRecorder) {
      setFacingMode("user");
      stopRecording(true);
      if (intialState) {
        startIntialCamera("user");
      } else {
        startNewRecording(true,'user');
      }
    }
    // Start recording with the updated facing mode
  };
  return (
    <>
      <div
        style={{
          backgroundColor: "#282828",
          width: "100%",
          margin: "0",
          padding: "0",
        }}
      >
        <video
          muted={true}
          style={{
            padding: "0px",
            width: "100%",
            height: "100vh",
            margin: "0",
          }}
          ref={videoRef}
          playsInline
          autoPlay
        />
        <div>
          <div className="controllerContainer">
   {/* {(frontMediaRecorder || backMediaRecorder) &&
      <img onClick={swapCamera} style={{cursor:'pointer'}} src={CameraSwitch} alt="SVG Image" />
    }*/}
     <img onClick={swapCamera} style={{cursor:'pointer'}} src={CameraSwitch} alt="SVG Image" />

            <div style={{display:'flex'}} className="icons">

            {/* either in intial state or not recording */}
        {intialState && <PiRecordFill onClick={()=>startNewRecording(false,facingMode)}  style={{cursor:'pointer', fontSize: "5rem", color: "red" }} /> }

        {/* Recording in progress */}
           <p style={{color:'white'}}>{time}</p>
           <br />
        {!intialState&&(
          <FaRecordVinyl onClick={()=>stopRecording(false)} style={{cursor:'pointer', fontSize: "5rem", color: "red" }} />
         )}
         {recordedChunks.length>0&&(
            <div
              style={{
                backgroundColor: "red",
                fontSize: "2rem",
                width: "2.5rem",
                textAlign: "center",
                borderRadius: "50%",
                height:'4rem',
              }}
             onClick={handleUpload}
            >
            <MdDone style={{cursor:'pointer', fontSize: "2rem", color: "white" }} />
            </div>

        )}
            </div>
          </div>
          {!frontMediaRecorder && !backMediaRecorder && (
            <Button style={{ marginRight: "1rem" }} onClick={startIntialCamera}>
              Start Camera
            </Button>
          )}

          <Button style={{ marginRight: "1rem" }} onClick={startNewRecording}>
            Start New Recording
          </Button>

          <Button style={{ marginRight: "1rem" }} onClick={stopRecording}>
            Stop Recording
          </Button>

          {(frontMediaRecorder || backMediaRecorder) && backCameraExists && (
            <Button style={{ marginTop: "1rem" }} onClick={swapCamera}>
              Swap Camera
            </Button>
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
          <Button onClick={handleUpload}>
            {uploading ? "Uploading" : "Upload Video"}
          </Button>
        </div>
      </div>
    </>
  );
}
