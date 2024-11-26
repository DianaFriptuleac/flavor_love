import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";

const Home = () => {
  const [ricette, setRicette] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/ricetteEsterne/allRicette")
      .then((response) => response.json())
      .then((data) => {
        console.log("Dati ricevuti dal backend:", data);
        setRicette(data);
      })
      .catch((error) => console.error("Errore:", error));
  }, []);
  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Le Nostre Ricette</h1>
      <Row>
        {ricette.length > 0 ? (
          ricette.map((ricetta, index) => (
            <Col md={4} sm={6} xs={12} className="mb-4" key={index}>
              <Card>
                <Card.Img
                  variant="top"
                  src={ricetta.image}
                  alt={ricetta.title}
                />
                <Card.Body>
                  <Card.Title>{ricetta.title}</Card.Title>
                  <Card.Text>
                    {ricetta.descrizione && ricetta.descrizione.length > 0
                      ? ricetta.descrizione.length > 100
                        ? `${ricetta.descrizione.substring(0, 100)}...`
                        : ricetta.descrizione
                      : "Descrizione non disponibile"}
                  </Card.Text>
                  <Card.Link href={`/ricetta/${ricetta.id}`}>
                    Leggi di più
                  </Card.Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-center">Caricamento delle ricette in corso...</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Home;
