import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  Carousel,
} from "react-bootstrap";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRicetteUtente } from "../redux/actions/fetchRicetteAction";
import "../css/RicetteUtente.css";

const RicetteUtente = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ricette = useSelector((state) => state.ricette.ricetteUtente);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (auth.token && auth.user?.id) {
      dispatch(fetchRicetteUtente());
    }
  }, [auth.token, auth.user?.id, dispatch]);

  //divido le ricette
  const divRicette = (array, size) => {
    const res = [];
    for (let i = 0; i < array.length; i += size) {
      res.push(array.slice(i, i + size));
    }
    return res;
  };

  const gruppiRicette = divRicette(ricette, 6);

  return (
    <Container>
      <div className="d-flex justify-content-between my-1">
        <h2 className="ricetteUtenteTitle mb-0">Le tue ricette:</h2>
        <Button
          className="creaRicetta-btn"
          onClick={() => navigate("/creaRicetta")}
        >
          Crea Ricetta
        </Button>
      </div>
      {ricette.length > 0 ? (
        <Row className="justify-content-center mx-0">
          <Col md={6} lg={10} className="p-0">
            <Carousel className="ricetteUtente-carousel">
              {gruppiRicette.map((gruppo, index) => (
                <Carousel.Item key={index} className="rUtente-item">
                  <div className="d-flex flex-wrap justify-content-center">
                    {gruppo.map((ricetta) => (
                      <Card
                        key={ricetta.id}
                        className="m-2 ricetteUtente-card"
                        style={{ width: "18rem", cursor: "pointer" }}
                        onClick={() => navigate(`/ricette/${ricetta.id}`)}
                      >
                        <Card.Img
                          className="rUtente-img"
                          variant="top"
                          src={
                            (ricetta.img &&
                              ricetta.img.length > 0 &&
                              ricetta.img[0].url) ||
                            "/assets/default_ricetta.jpg"
                          }
                          alt={ricetta.titolo}
                        />
                        <Card.Body className="p-0">
                          <Card.Title className="uRicette-title">
                            {ricetta.titolo}
                          </Card.Title>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      ) : (
        <Alert variant="success" className="text-center mt-4 noRicetteAlert">
          Nessuna ricetta creata. Inizia a creare la tua prima ricetta!
        </Alert>
      )}
    </Container>
  );
};

export default RicetteUtente;
