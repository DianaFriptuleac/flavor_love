import { useSelector} from "react-redux";
import { Container, Alert, Row, Col, Card, Button,Spinner } from "react-bootstrap";
import { FaHeart} from "react-icons/fa";
import { useState, useEffect  } from "react";

const Liked = () => {
  const token = useSelector((state) => state.auth.token);
  const [likedRicette, setLikedRicette] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch ricette Liked
  const fetchLikedRicette = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/liked", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setLikedRicette(data.ricette || []);
      } else {
        throw new Error("Errore nel recupero delle ricette preferite.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Aggiungi o rimuovi una ricetta dai Liked
  const toggleLike = async (ricetta) => {
    try {
      const exists = likedRicette.some((liked) => liked.id === ricetta.id);

      const response = await fetch(
        `http://localhost:3001/api/liked/${ricetta.id}`,
        {
          method: exists ? "DELETE" : "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        if (exists) {
          setLikedRicette((prev) => prev.filter((liked) => liked.id !== ricetta.id));
        } else {
          setLikedRicette((prev) => [...prev, ricetta]);
        }
      } else {
        throw new Error(
          exists
            ? "Errore nella rimozione della ricetta dai preferiti."
            : "Errore nell'aggiunta della ricetta ai preferiti."
        );
      }
         // Aggiorno lo stato locale
         setLikedRicette((prev) =>
          exists
            ? prev.filter((liked) => liked.id !== ricetta.id)
            : [...prev, ricetta]
        );
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchLikedRicette();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!likedRicette.length)
    return (
      <Container>
        <Alert variant="info">Non hai ancora aggiunto ricette ai preferiti.</Alert>
      </Container>
    );

  return (
    <Container>
      <h2>Le tue ricette preferite</h2>
      <Row>
        {likedRicette.map((ricetta) => (
          <Col key={ricetta.id} md={4}>
            <Card className="mb-4">
              <Card.Img
                variant="top"
                src={ricetta.img[0]?.url || "/assets/default_ricetta.jpg"}
              />
              <Card.Body>
                <Card.Title>{ricetta.titolo}</Card.Title>
                <Button
                  variant="light"
                  onClick={() => toggleLike(ricetta)}
                  style={{ color: "red" }}
                >
                  <FaHeart />
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Liked;
