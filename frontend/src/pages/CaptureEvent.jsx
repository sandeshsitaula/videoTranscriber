import { useState, useEffect, useRef } from "react";
import { Button, FormControl } from "react-bootstrap";
import { PiRecordFill } from "react-icons/pi";
import { FaRecordVinyl } from "react-icons/fa6";
import { MdDone } from "react-icons/md";
import "./css/CaptureEvent.css";
import CameraSwitch from "../assets/cameraswitch.svg";
import RecordStart from "../assets/RecordStart.png";
import RecordStop from "../assets/RecordStop.png";
import Tick from "../assets/tick.png";
import { MdCameraswitch } from "react-icons/md";
export function CaptureEvent(props) {
  const [eventName, setEventName] = useState("00:00");
  const [uploading, setUploading] = useState(false);
  const [intialState, setIntialState] = useState(true);
  const [frontMediaRecorder, setFrontMediaRecorder] = useState(null);
  const [backMediaRecorder, setBackMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isIOS, setIsIOS] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const [backCameraExists, setBackCameraExists] = useState(true);
  const [time, setTime] = useState("");
  const videoRef = useRef(null);
  const recorderRef = useRef(null);
  const timerIntervalRef = useRef(null); // Ref to store interval ID
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
    const constraints = {
      video: {
        facingMode: facingMode // 'user' for front camera, 'environment' for back camera
      },
      audio: true
    };

    const mergedStream = await navigator.mediaDevices.getUserMedia(constraints);
    videoRef.current.srcObject = mergedStream;
    // Capture audio from the surrounding environment
    return mergedStream;
  }
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
          videoBitsPerSecond: 8000000
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
      recorderRef.current = recorder;
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  }
  useEffect(() => {
    if (intialState) {
      startIntialCamera("user");
    }
  }, []);

  const startNewRecording = async (swap = false, facingMode = facingMode) => {
    if (swap) {
      await startIntialCamera(facingMode);
    } else {
      setTime("00:00");
      setRecordedChunks([]);
    }
    setIntialState(false);
    startRecording(facingMode);
  };

  const startRecording = async (facingMode = "user") => {
    try {
      recorderRef.current.start();
      recorderRef.current.ondataavailable = handleDataAvailable;
      let seconds = 0;
      let minutes = 0;
      timerIntervalRef.current = setInterval(() => {
        seconds++;
        if (seconds === 60) {
          seconds = 0;
          minutes++;
        }
        setTime(
          `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      }, 1000);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const stopRecording = (swap = false) => {
    clearInterval(timerIntervalRef.current);
    if (swap) {
      recorderRef.current.stop();
      recorderRef.current = null;
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
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    } else {
      recorderRef.current.stop();
      setIntialState(true);
      if (frontMediaRecorder) {
        frontMediaRecorder.stop();
      }
      if (backMediaRecorder) {
        backMediaRecorder.stop();
      }
    }
  };

  const handleDataAvailable = event => {
    if (event.data.size > 0) {
      setRecordedChunks(prevChunks => [...prevChunks, event.data]);
    }
  };

  function handleEventNameChange(e) {
    setEventName(e.target.value);
  }

  async function handleUpload() {
    var eventName = crypto.randomUUID();
    console.log(eventName);
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
        return;
      } else {
        startNewRecording(true, "environment");
        return;
      }
    }
    if (backMediaRecorder) {
      setFacingMode("user");
      stopRecording(true);
      if (intialState) {
        startIntialCamera("user");
      } else {
        startNewRecording(true, "user");
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
          padding: "0"
        }}
      >
        <video
          muted={true}
          style={{
            padding: "0px",
            width: "100%",
            height: "100vh",
            margin: "0"
          }}
          ref={videoRef}
          playsInline
          autoPlay
        />
        <div>
          <div className="controllerContainer">
            <div style={{ position: "absolute", bottom: "130px", left: "10%" }}>
              {!!recorderRef.current &&
                backCameraExists && (
                  <MdCameraswitch
                    style={{
                      fontSize: "3rem",
                      color: "white",
                      cursor: "pointer"
                    }}
                    onClick={swapCamera}
                  />
                )}
            </div>
            <div className="icons">
              {/* either in intial state or not recording */}
              {intialState && (
                <div
                  onClick={() => startNewRecording(false, facingMode)}
                  style={{ cursor: "pointer", color: "red" }}
                >
                  <img src={RecordStart} height="100" width="100" />
                </div>
              )}

              <p
                style={{
                  color: "red",
                  margin: "0",
                  marginLeft: "1.5rem",
                  padding: "0"
                }}
              >
                {time}
              </p>
              {!intialState && (
                <div
                  onClick={() => stopRecording(false)}
                  style={{
                    cursor: "pointer",
                    margin: "0",
                    padding: "0",
                    color: "red"
                  }}
                >
                  <img src={RecordStop} height="100" width="100" />
                </div>
              )}
            </div>
            {recordedChunks.length > 0 &&
              intialState && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "130px",
                    right: "10%",
                    cursor: "pointer"
                  }}
                  onClick={handleUpload}
                >
                  <img src={Tick} height="60" width="60" />
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
}
