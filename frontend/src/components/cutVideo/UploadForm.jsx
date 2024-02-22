// UploadForm.js
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axiosInstance from "../../axiosInstance";
import { CutVideoModal } from "./CutVideoModal";

const UploadForm = (props) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [videoName, setVideoName] = useState("");
  const [subtitleData, setSubtitleData] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [subtitleToCut, setSubtitleToCut] = useState("");
  const [originalVideoName, setOrignalVideoName] = useState("");
  const [cutVideoName, setCutVideoName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    var tempVideoName = event.target.files[0].name
      .split(".")
      .slice(0, -1)
      .join(".");
    setVideoName(tempVideoName);
  };
  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    try {
      //handle uplad is in utils folder 
      const result = await props.handleFileUpload(file, videoName);
      setSubtitleData(result.data.data);
    } catch (error) {
      alert(error.error);
      console.error("Error uploading chunk:", error);
    } finally {
      setUploading(false);
    }
  }

  const handleFileDownload = async (target) => {
    if (loading) {
      alert("In progress.Wait a while");
      return;
    }
    setLoading(true);
    try {
      const downloadUrl = `http://meet.fractalnetworks.co:8000/api/filedownload/${target}`;
      // Create a dynamic <a> tag
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", ""); // Set the download attribute to trigger download
      document.body.appendChild(link);

      // Initiate the download
      link.click();
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert(error);
      }
    }
  };

  return (
    <>
      {showModal && (
        <CutVideoModal
          videoName={videoName}
          subtitleToCut={subtitleToCut}
          setSubtitleToCut={setSubtitleToCut}
          setModal={setShowModal}
          setOriginalVideoName={setOrignalVideoName}
          setCutVideoName={setCutVideoName}
        />
      )}

      <div style={{ backgroundColor: "#242424" }}>
        <div style={{ color: "white" }} className="fileUpload">
          <input type="file" onChange={handleFileChange} />
          <button onClick={() => handleUpload()} disabled={uploading}>
            {uploading ? "Uploading..." : "Submit"}
          </button>
        </div>
        {subtitleData && (
          <div
            style={{ marginTop: "5rem", color: "white" }}
            className="subtitleText"
          >
            <div style={{ textAlign: "center" }}>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                Cut Video
              </Button>
              {originalVideoName.length > 0 && cutVideoName.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    marginTop: "2rem",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="primary"
                    onClick={() => handleFileDownload(originalVideoName)}
                    disabled={loading}
                  >
                    Download Original Video
                  </Button>
                  <Button
                    style={{ marginLeft: "2rem" }}
                    variant="primary"
                    onClick={() => handleFileDownload(cutVideoName)}
                    disabled={loading}
                  >
                    Download Cut Video
                  </Button>
                </div>
              )}
            </div>

            <h4>Generated Subtitles</h4>

            <p style={{ marginTop: "2rem" }}>{subtitleData}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadForm;
