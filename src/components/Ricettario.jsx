import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";
import {
  setRicettari,
  addRicettario,
  removeRicettario,
} from "../redux/actions/ricettarioActions";
import { useNavigate } from "react-router-dom";
import "../css/Ricettario.css";

const Ricettario = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const ricettari = useSelector((state) => state.ricettari.list);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [ricettarioName, setRicettarioName] = useState("");
  const [localRicettari, setLocalRicettari] = useState([]);
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();

    // fetch per img random da ricettario.json
    useEffect(() => {
      const fetchLocalRicettari = async () => {
        try {
          const response = await fetch('/assets/ricettario.json'); 
          if (response.ok) {
            const data = await response.json();
            setLocalRicettari(data.ricettari); 
          } else {
            console.error("Errore nel caricamento del file JSON");
          }
        } catch (error) {
          console.error("Errore durante il fetch del file JSON:", error.message);
        }
      };
  
      fetchLocalRicettari();
    }, []);
    

  // Fetch -> get ricettari
  const fetchRicettari = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/ricettari", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Ricettari fetch response:", data);
        dispatch(setRicettari(data.content));
      }
    } catch (error) {
      console.error("Errore nel fetch:", error.message);
    }
  };

  //img random
  const getRandomImage = () => {
    if (localRicettari.length > 0) {
      const randomIndex = Math.floor(Math.random() * localRicettari.length);
      return localRicettari[randomIndex].imgUrl;
    }
    return "/assets/default_ricetta.jpg"; 
  };

  // Creo  ricettario
  const handleCreateRicettario = async () => {
    if (!ricettarioName.trim()) {
      setAlert("Il nome del ricettario non può essere vuoto.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/api/ricettari", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome: ricettarioName }),
      });
      if (response.ok) {
        const newRicettario = await response.json();
        dispatch(addRicettario(newRicettario));
        setShowCreateModal(false);
        setRicettarioName("");
      }
    } catch (error) {
      console.error("Errore nella creazione:", error.message);
    }
  };

  // Cancello ricettario
  const handleDeleteRicettario = async (ricettarioId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/ricettari/${ricettarioId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        dispatch(removeRicettario(ricettarioId));
      }
    } catch (error) {
      console.error("Errore nella cancellazione:", error.message);
    }
  };

  useEffect(() => {
    fetchRicettari();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, token]);

  return (
    <div className="bg-ricettario">
      <Container>
        <h2 className="titolo-ricettario">I miei Ricettari</h2>
        <Row className="mt-4">
          {Array.isArray(ricettari) && ricettari.length > 0 ? (
            ricettari.map((ricettario) => (
              <Col md={4} className="mb-4" key={ricettario.id}>
                <Card className="ricettario-card">
                <Card.Img
                    variant="top"
                    src={getRandomImage()} // Immagine random
                    alt={ricettario.nome}
                    className="ricettario-card-img"
                  />
                  <Card.Body>
                    <Card.Title>{ricettario.nome}</Card.Title>
                    <div className="d-flex justify-content-between">
                      <Button
                        variant="info"
                        onClick={() => navigate(`/ricettari/${ricettario.id}`)}
                      >
                        Visualizza
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteRicettario(ricettario.id)}
                      >
                        Elimina
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Alert variant="info">
              Nessun ricettario trovato. Vuoi crearne uno?
            </Alert>
          )}
        </Row>
        <Button
          variant="primary"
          className="mt-3"
          onClick={() => setShowCreateModal(true)}
        >
          Crea Ricettario
        </Button>
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Crea Ricettario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Nome Ricettario</Form.Label>
              <Form.Control
                type="text"
                value={ricettarioName}
                onChange={(e) => setRicettarioName(e.target.value)}
                placeholder="Inserisci il nome del ricettario"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Chiudi
            </Button>
            <Button variant="primary" onClick={handleCreateRicettario}>
              Crea
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default Ricettario;
