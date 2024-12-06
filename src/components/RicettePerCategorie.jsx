import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Card, Alert } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RicettePerCategorie = () => {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const [ricette, setRicette] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchRicettaByCategorie = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!token) {
          console.error("Token mancante!");
          throw new Error("Token mancante!");
        }

        const resp = await fetch(
          `http://localhost:3001/api/ricette/categoria?categoria=${categoria}&page=0&size=10&sortBy=titolo`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!resp.ok) {
          if (resp.status === 404) {
            throw new Error("Nessuna ricetta trovata per questa categoria.");
          } else {
            throw new Error("Errore nel recupero delle ricette!");
          }
        }

        const data = await resp.json();

        if (!data.content || data.content.length === 0) {
          throw new Error("Nessuna ricetta trovata per questa categoria.");
        }

        setRicette(data.content || []);
      } catch (err) {
        setError(err.message);

        if (err.message.includes("Nessuna ricetta trovata")) {
          setTimeout(() => {
            navigate("/ricette");
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    if (categoria) {
      fetchRicettaByCategorie();
    }
  }, [categoria, token, navigate]);

  return (
    <Container>
      <h2>Ricette per Categoria: {categoria}</h2>
      {loading && <Spinner animation="border" />}
      {error && (
        <Alert variant="danger">
          {error} <br /> Reindirizzamento a tutte le ricette...
        </Alert>
      )}
      <Row>
        {ricette.map((ricetta) => (
          <Col key={ricetta.id} md={4}>
            <Card className="mb-4">
              <Card.Img
                variant="top"
                src={ricetta.img[0]?.url || "/assets/default_ricetta.jpg"}
              />
              <Card.Body>
                <Card.Title>{ricetta.titolo}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RicettePerCategorie;
