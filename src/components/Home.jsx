import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col, Carousel } from "react-bootstrap";
import "../css/Home.css";

const Home = () => {
  const [ricette, setRicette] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/ricetteEsterne/allRicette?page=0&size=1000")
      .then((response) => response.json())
      .then((data) => {
        if (data && data.content) {
          const ricetteComplete = data.content.filter(
            (ricetta) => ricetta.title && ricetta.instructions && ricetta.image
          );
          console.log("Ricette con dati completi:", ricetteComplete);
          //salvo le ricette filtrate
          setRicette(ricetteComplete);
        } else {
          console.error("Formato dei dati non valido:", data);
        }
      })
      .catch((error) =>
        console.error("Errore nel caricamento delle ricette:", error)
      );
  }, []);

  //divido le ricette in gruppi da 6
  const carouselRows = (ricette, ricettaPerRow) => {
    const rows = [];
    for (let i = 0; i < ricette.length; i += ricettaPerRow) {
      rows.push(ricette.slice(i, i + ricettaPerRow));
    }
    return rows;
  };

  // Righe da 6 ricette
  const ricetteInRows = carouselRows(ricette, 6);

  return (
    <div className="home-background">
      <Container className="mt-5">
        <h1 className="mb-4 text-light homeTitle">Le Nostre Ricette</h1>
        <Carousel interval={null} className="carousel-container">
          {ricetteInRows.map((group, index) => (
            <Carousel.Item key={index}>
              <Row>
                {group.map((ricetta) => (
                  <Col
                    xl={4}
                    md={6}
                    sm={12}
                    xs={12}
                    key={ricetta.id}
                    className="mb-4"
                  >
                    <Card className="ricetta-card">
                      <div className="img-container">
                        <Card.Img
                          variant="top"
                          src={ricetta.image || "/assets/default_ricetta.jpg"}
                          alt={ricetta.title || "Ricetta"}
                          className="ricetta-img"
                          //X URL dell'img errato o img. che non si carica -> onError x vedere img. di default
                          onError={(e) => {
                            // Previene il loop infinito
                            e.target.onerror = null; 
                            e.target.src = "/assets/default_ricetta.jpg";
                          }}
                        />
                        <div className="title-card">
                          <Card.Title className="ricetta-title">
                            {ricetta.title}
                          </Card.Title>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </div>
  );
};

export default Home;
