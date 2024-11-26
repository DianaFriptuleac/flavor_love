import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();  //un hook che ci riporta alla pagina
  return (
    <Container>
      <Row className="justify-content-center my-5 text-light" >
        <Col xs={12} md={6}>
          <h2>404 - Not found</h2>
          <p>
            Ci dispiace, ma la pagina che stavi cercando non può essere trovata.
          </p>
          <Button
            variant="info"
            onClick={() => {
              navigate("/"); //riporta a homepage
            }}
          >
            TORNA IN HOMEPAGE
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;