import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Card, Alert, ListGroup } from "react-bootstrap";

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
      const response = await fetch(`http://localhost:3001/api/ricetteEsterne/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("DETTAGLI RICETTE ESTERNE", data)
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
    <Container>
      {alert.message && <Alert variant={alert.variant}>{alert.message}</Alert>}
      <Card className="mt-3">
        <Card.Img
          variant="top"
          src={dettagli.image || "/assets/default_ricetta.jpg"}
          alt={dettagli.title}
        />
        <Card.Body>
          <Card.Title>{dettagli.title}</Card.Title>
          <Card.Text>
            <strong>Procedimento:</strong> {dettagli.instructions}
          </Card.Text>
          <strong>Ingredienti:</strong>
          <ListGroup className="mb-3">
            {(dettagli.ingredienti || []).map((ing, index) => (
              <ListGroup.Item key={index}>
                {ing.name} - {ing.amount} {ing.unit}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DettagliRicetteEsterne;
