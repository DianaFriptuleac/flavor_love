import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Alert,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  CardBody,
} from "react-bootstrap";
import { FaHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import "../css/Liked.css";

const Liked = () => {
  const token = useSelector((state) => state.auth.token);
  const [likedRicette, setLikedRicette] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch ricette Liked
  useEffect(() => {
    const fetchLikedRicette = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://capstone-flavor-love-1.onrender.com/api/liked", {
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

    fetchLikedRicette();
  }, [token]);
  // Aggiunge o rimuove una ricetta dai Liked
  const toggleLike = async (ricetta) => {
    try {
      const exists = likedRicette.some((liked) => liked.id === ricetta.id);

      const response = await fetch(
        `https://capstone-flavor-love-1.onrender.com/api/liked/${ricetta.id}`,
        {
          method: exists ? "DELETE" : "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        setLikedRicette((prev) =>
          exists
            ? prev.filter((liked) => liked.id !== ricetta.id)
            : [...prev, ricetta]
        );
      } else {
        throw new Error(
          exists
            ? "Errore nella rimozione della ricetta dai preferiti."
            : "Errore nell'aggiunta della ricetta ai preferiti."
        );
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!likedRicette.length)
    return (
      <div className="bg-liked">
        <Container>
          <Row className="mt-5 justify-content-center flex-column align-items-center">
            <Alert className="alertLiked">
              Non hai ancora aggiunto ricette ai preferiti.
            </Alert>
            <Button
              className="alertLiked-btn"
              onClick={() => navigate(`/userprofile`)}
            >
              Torna al tuo account
            </Button>
          </Row>
        </Container>
      </div>
    );

  return (
    <div className="bg-liked">
      <Container>
        <h2 className="title-liked">Le tue ricette preferite:</h2>
        <Row className="mt-4">
          {likedRicette.map((ricetta) => (
            <Col key={ricetta.id} md={6} lg={4} xl={3}>
              <Card className="mb-4 likedCard">
                <div className="heartLiked">
                  <Button
                    variant="light"
                    onClick={() => toggleLike(ricetta)}
                    className="like-button-overlay"
                  >
                    <FaHeart />
                  </Button>
                </div>
                <Card.Img
                  variant="top"
                  onClick={() => navigate(`/ricette/${ricetta.id}`)}
                  src={ricetta.img[0]?.url || "/assets/default_ricetta.jpg"}
                  className="card-liked-image"
                />
                <CardBody className="cardHeader-overlay d-flex align-items-center flex-column p-2">
                  <Card.Title className="card-title-overlay mb-0">
                    {ricetta.titolo}
                  </Card.Title>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Liked;
