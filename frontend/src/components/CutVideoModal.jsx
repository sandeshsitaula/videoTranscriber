import { Modal, FormControl, Form, Col, Button } from "react-bootstrap";
import { useState } from "react";
import axiosInstance from "../axiosInstance";
export const CutVideoModal = (props) => {
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    props.setSubtitleToCut(e.target.value);
    console.log(e.target.value);
  }

  async function handleSubmit() {
    if (loading) {
      return;
    }
    if (props.subtitleToCut.length <= 0) {
      alert("enter some subtitle to cut");
      return;
    }
    setLoading(true);
    try {
      const postData = {
        subtitleToCut: props.subtitleToCut,
        videoName: props.videoName,
      };
      const response = await axiosInstance.post("cutvideo/", postData);
      console.log(response.data);
      alert(response.data.message);
      props.setOriginalVideoName(response.data.original_video);
      props.setCutVideoName(response.data.cut_video);
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert(error);
      }
      setLoading(false);
    }
  }
  const handleClose = () => {
    props.setModal(false);
  };
  return (
    <>
      <Modal
        show={true}
        size="xl"
        onHide={handleClose}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body
          style={{ display: "flex", justifyContent: "center", padding: "0px" }}
        >
          <Col sm={9} md={5}>
            <div style={{ backgroundColor: "white" }}>
              <h5 style={{ textAlign: "center", paddingBottom: "20px" }}>
                Cut Video
              </h5>

              <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                <Form.Control
                  placeholder="Paste the part of generated subtitle"
                  as="textarea"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  value={props.subtitleToCut}
                  rows={5}
                />

                <Button
                  disabled={loading}
                  style={{
                    width: "75%",
                    marginButton: "4rem",
                    marginTop: "2rem",
                  }}
                  variant="outline-success"
                  onClick={handleSubmit}
                >
                  {loading ? "Loading" : "Cut Video"}
                </Button>
              </div>
            </div>
          </Col>
        </Modal.Body>
      </Modal>
    </>
  );
};
