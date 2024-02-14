  import {Modal,FormControl,Form,Col,Button} from 'react-bootstrap'
import {useState} from 'react'
 export const CutVideoModal=(props)=>{
    const [loading, setLoading] = useState(false);
    const [subtitleToCut,setSubtitleToCut]=useState('')

    function handleChange(e){
    setSubtitleToCut(e.target.value)
    console.log(e.target.value)
    }

    async function handleSubmit() {
    if (loading) {
      return;
    }
    if (subtitleToCut.length<=1){
        alert("enter some subtitle to cut")
        return
    }
    setLoading(true);
    try {
      const response =
      alert(response.data.message);
      setLoading(false);

    } catch (error) {
      alert(error.error);
      setLoading(false);
    }
  }
      const handleClose = () => { props.setModal(false) };
      return(
          <>
          <Modal show={true} size="xl" onHide={handleClose}  centered
backdrop="static"
keyboard={false}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body style={{display:'flex',justifyContent:'center', padding:
"0px" }}>
         <Col sm={9} md={5}>
              <div style={{ backgroundColor: "white" }}>
                <h5 style={{ textAlign: "center", paddingBottom: "20px" }}>
                  Cut Video
                </h5>

                  <div style={{textAlign:'center',marginBottom:'4rem'}}>
                  <Form.Control
                  placeholder="Paste the part of generated subtitle"
                  as="textarea"
                  onChange={(e)=>{handleChange(e)}}
                  value={subtitleToCut}
                  rows={5} />

                      <Button
                        disabled={loading}
                        style={{ width: "75%",marginButton:'4rem'
,marginTop:'2rem'}}
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
    )
}


