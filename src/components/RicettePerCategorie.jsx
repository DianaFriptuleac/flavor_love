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
import { useSelector, useDispatch } from "react-redux";
import { Pagination } from "react-bootstrap";
import { likedRicette } from "../redux/actions/likedActions";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const RicettePerCategorie = () => {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [ricette, setRicette] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const token = useSelector((state) => state.auth.token);
  const likedRicetteState = useSelector((state) => state.liked.ricette);

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
          `http://localhost:3001/api/ricette/categoria?categoria=${categoria}&page=${page}&size=10&sortBy=titolo`,
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


  // Liked
  const toggleLike = async (ricetta) => {
    try {
      const isCurrentlyLiked = likedRicetteState.some((liked) => liked.id === ricetta.id);

      const response = await fetch(
        `http://localhost:3001/api/liked/${ricetta.id}`,
        {
          method: isCurrentlyLiked ? "DELETE" : "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        dispatch(likedRicette(ricetta));
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

  const isLiked = (ricettaId) => {
    return likedRicetteState.some((ricetta) => ricetta.id === ricettaId);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
                key={ricetta.id}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/ricette/${ricetta.id}`)}
              />
              <Card.Body>
                <Card.Title>{ricetta.titolo}</Card.Title>
                <Button
                  variant="light"
                  onClick={() => toggleLike(ricetta)}
                  style={{ color: isLiked(ricetta.id) ? "red" : "gray" }}
                >
                  {isLiked(ricetta.id) ? <FaHeart /> : <FaRegHeart />}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Pagination className="justify-content-center mt-4">
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
  );
};

export default RicettePerCategorie;
