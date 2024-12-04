import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRicetteUtente } from "../redux/actions/fetchRicetteAction";
import "../css/RicetteUtente.css";


const RicetteUtente = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ricette = useSelector((state) => state.ricette.ricette);
  const auth = useSelector((state) => state.auth);

  console.log("Stato auth nel componente RicetteUtente:", auth);

  useEffect(() => {
    if (auth.token && auth.user?.id) {
      dispatch(fetchRicetteUtente());
    }
  }, [auth.token, auth.user?.id, dispatch]);
  
  
  return (
    <Container>
      <div className="d-flex justify-content-between my-1">
        <h2 className="ricetteUtenteTitle mb-0">Le tue ricette:</h2>
        <Button className="creaRicetta-btn" onClick={() => navigate("/creaRicetta")}>
          Crea Ricetta
        </Button>
      </div>
      {ricette.length > 0 ? (
        <Row>
          {ricette.map((ricetta) => (
            <Col key={ricetta.id} md={4} className="mb-4">
              <Card
                onClick={() => navigate(`/ricette/${ricetta.id}`)}
                style={{ cursor: "pointer" }}
              >
                <Card.Img
                  variant="top"
                  src={
                    (ricetta.img &&
                      ricetta.img.length > 0 &&
                      ricetta.img[0].url) ||
                    "/assets/default_ricetta.jpg"
                  }
                  alt={ricetta.titolo}
                />
                <Card.Body>
                  <Card.Title>{ricetta.titolo}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="text-center mt-4">
          Nessuna ricetta creata. Inizia a creare la tua prima ricetta!
        </Alert>
      )}
    </Container>
  );
};

export default RicetteUtente;
