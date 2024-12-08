import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Card, Alert, ListGroup, Row, Col } from "react-bootstrap";
import { FaRegClock } from "react-icons/fa";
import { PiCookingPotDuotone } from "react-icons/pi";
import { HiOutlineCurrencyEuro } from "react-icons/hi2";
import { TbChefHat } from "react-icons/tb";

import "../css/DettagliRicettaEsterna.css";

const DettagliRicetteEsterne = () => {
  const { id } = useParams(); // id ricetta dai parametri URL

  const token = useSelector((state) => state.auth.token);

  const [dettagli, setDettagli] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState({ message: "", variant: "" });

  // Fetch dettagli ricetta esterna
  const fetchDettagliRicetta = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3001/api/ricetteEsterne/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("DETTAGLI RICETTE ESTERNE", data);
        setDettagli(data);
      } else {
        throw new Error("Errore nel recupero dati delle ricette esterne.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchDettagliRicetta();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //carricamento
  if (loading) {
    return <Alert variant="info">Caricamento dettagli ricetta...</Alert>;
  }

  // errore
  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  // NotFound
  if (!dettagli) {
    return <Alert variant="info">Nessuna ricetta trovata.</Alert>;
  }

  return (
    <div className="bg-dettagliRicettaEsterna">
      <Container className="mt-4 dettagli-ricetta">
        {alert.message && (
          <Alert variant={alert.variant}>{alert.message}</Alert>
        )}
        <Row>
          <Col md={6}>
            <Card className="shadow-sm border border-0">
              <Card.Img
                variant="top"
                src={dettagli.image || "/assets/default_ricetta.jpg"}
                alt={dettagli.title}
                className="rounded-img"
              />
            </Card>
          </Col>

          <Col md={6} className="mt-2">
            <Card className="shadow-sm border-0 p-3">
              <Card.Body>
                <Card.Title className="titleCard display-6">
                  {dettagli.title}
                </Card.Title>

                <ListGroup className="list-unstyled">
                  <li className="d-flex align-items-center">
                    <FaRegClock className="me-3" />
                    <strong className="me-2">Preparazione:</strong> Basta un po' di pazienza!
                  </li>
                  <li className="d-flex align-items-center">
                    <PiCookingPotDuotone className="me-3" />
                    <strong className="me-2">Cottura:</strong> Il profumo guiderà il tempo
                  </li>
                  <li className="d-flex align-items-center">
                    <TbChefHat className="me-3" />
                    <strong className="me-2">Difficoltà:</strong> Chiunque può farcela!
                  </li>
                  <li className="d-flex align-items-center">
                    <HiOutlineCurrencyEuro className="me-3" />
                    <strong className="me-2">Costo:</strong> Accessibile a tutti
                  </li>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <h2 className="fw-bold ms-1">Ingredienti:</h2>
            <ListGroup>
              {(dettagli.ingredienti || []).map((ing, index) => (
                <ListGroup.Item
                  key={index}
                  className="d-flex justify-content-between"
                >
                  <span className="fw-bold ingredienti-nome">{ing.name}</span>
                  <span>
                    {ing.amount} {ing.unit}
                  </span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
          <h2 className="fw-bold mb-0 ms-1">Preparazione:</h2>
          <Card className="my-3">
            <Card.Text className="p-3 preparazione">
              {dettagli.instructions || "Non ci sono istruzioni associate a questa ricetta. Libera la tua creatività in cucina e inventa il procedimento!"}
            </Card.Text>
          </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DettagliRicetteEsterne;
