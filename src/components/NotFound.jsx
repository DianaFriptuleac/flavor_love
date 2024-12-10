import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/NotFoud.css";

const NotFound = () => {
  const navigate = useNavigate(); //un hook che ci riporta alla pagina
  return (
    <div className="notFound-bg">
      <Container>
        <Row className="justify-content-end my-5 text-light">
          <Col xs={12} md={6} className="text-black">
            <h2>404 - Not found</h2>
            <p>
              Ci dispiace, ma la pagina che stai cercando non può essere
              trovata.
            </p>
            <Button
              className="notFount-btn"
              onClick={() => {
                navigate("/");
              }}
            >
              TORNA ALLA HOMEPAGE
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotFound;
