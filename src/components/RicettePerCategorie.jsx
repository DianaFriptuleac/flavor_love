import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Card,
  Alert,
  Button,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector} from "react-redux";
import { Pagination } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../css/RicettePerCategorie.css"

const RicettePerCategorie = () => {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const [ricette, setRicette] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const token = useSelector((state) => state.auth.token);
  const [likedRicette, setLikedRicette] = useState([]);

  useEffect(() => {
    const fetchRicettaByCategorie = async (page) => {
      setLoading(true);
      setError(null);

      try {
        if (!token) {
          console.error("Token mancante!");
          throw new Error("Token mancante!");
        }

        const resp = await fetch(
          `http://localhost:3001/api/ricette/categoria?categoria=${categoria}&page=${page}&size=12&sortBy=titolo`,
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
        setTotalPages(data.totalPages || 1);

          // Fetch initial liked ricette
          const likedResp = await fetch("http://localhost:3001/api/liked", {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          if (likedResp.ok) {
            const likedData = await likedResp.json();
            setLikedRicette(likedData.ricette || []);
          }

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
      fetchRicettaByCategorie(currentPage);
    }
  }, [categoria, currentPage, token, navigate]);

const isLiked = (ricettaId) => {
  return likedRicette.some((ricetta) => ricetta.id === ricettaId);
};

  const toggleLike = async (ricetta) => {
    try {
      const isCurrentlyLiked = isLiked(ricetta.id);

      const response = await fetch(
        `http://localhost:3001/api/liked/${ricetta.id}`,
        {
          method: isCurrentlyLiked ? "DELETE" : "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        setLikedRicette((prev) =>
          isCurrentlyLiked
            ? prev.filter((liked) => liked.id !== ricetta.id)
            : [...prev, ricetta]
        );
      } else {
        throw new Error(
          isCurrentlyLiked
            ? "Errore nella rimozione della ricetta dai preferiti."
            : "Errore nell'aggiunta della ricetta ai preferiti."
        );
      }
    } catch (err) {
      console.error(err.message);
    }
  };

 
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-categorie">
    <Container fluid>
      <h2 className="categorie-title">Ricette per Categoria: {categoria}</h2>
      {loading && <Spinner animation="border" />}
      {error && (
        <Alert variant="danger">
          {error} <br /> Reindirizzamento a tutte le ricette...
        </Alert>
      )}
    <Row className="img-card-container">
        {ricette.map((ricetta) => (
           <Col key={ricetta.id} md={6} lg={3} className="card-container">
           <Card className="categorie-card mb-3">
            <div className="heart-container">
            <Button
                className="categorie-btn"
                  variant="light"
                  onClick={() => toggleLike(ricetta)}
                  style={{ color: isLiked(ricetta.id) ? "red" : "red" }}
                >
                  {isLiked(ricetta.id) ? <FaHeart className="heart-icon" /> : <FaRegHeart />}
                </Button>
            </div>
              <Card.Img
                variant="top"
                className="card-img-categorie"
                src={ricetta.img[0]?.url || "/assets/default_ricetta.jpg"}
                key={ricetta.id}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/ricette/${ricetta.id}`)}
              />
              <Card.Body className="card-body-categorie d-flex align-items-center flex-column p-2">
                <Card.Title className="card-title-categorie mb-0">{ricetta.titolo}</Card.Title>
              </Card.Body>
            </Card>
        </Col>
          ))}
      </Row>
      <Pagination className="justify-content-center mt-4 categorie-pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
    </div>
  );
};

export default RicettePerCategorie;
