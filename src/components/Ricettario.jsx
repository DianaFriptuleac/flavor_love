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
import { FaTrashAlt} from "react-icons/fa";
import "../css/Ricettario.css";

const Ricettario = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const ricettari = useSelector((state) => state.ricettari.list);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRicettarioId, setSelectedRicettarioId] = useState(null);
  const [ricettarioName, setRicettarioName] = useState("");
  const [localRicettari, setLocalRicettari] = useState([]);
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();

  // fetch per img random da ricettario.json
  useEffect(() => {
    const fetchLocalRicettari = async () => {
      try {
        const response = await fetch("/assets/ricettario.json");
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
  const confirmDeleteRicettario = (ricettarioId) => {
    setSelectedRicettarioId(ricettarioId);
    setShowDeleteModal(true);
  };
  const handleDeleteRicettario = async () => {
    if (!selectedRicettarioId) return;
    try {
      const response = await fetch(
        `http://localhost:3001/api/ricettari/${selectedRicettarioId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        dispatch(removeRicettario(selectedRicettarioId));
        setShowDeleteModal(false);
        setSelectedRicettarioId(null);
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
        <Row className="align-items-center mb-4 justify-content-end">
          <Col xs="auto">
            <Button
              className="ricettario-crea-btn"
              onClick={() => setShowCreateModal(true)}
            >
              Crea Ricettario
            </Button>
          </Col>
          <Col xs="auto">
            <h2 className="titolo-ricettario">I miei Ricettari</h2>
          </Col>
        </Row>
      </Container>
      <Container className="d-flex justify-content-end me-0">
        <Row>
          {Array.isArray(ricettari) && ricettari.length > 0 ? (
            ricettari.map((ricettario) => (
              <Col lg={4} md={6} sm={12} className="mb-4" key={ricettario.id}>
                <Card className="ricettario-card">
                  <div className="img-container">
                    <Card.Img
                      onClick={() => navigate(`/ricettari/${ricettario.id}`)}
                      variant="top"
                      src={getRandomImage()} // Immagine random
                      alt={ricettario.nome}
                      className="ricettario-card-img"
                    />
                    <Card.Body className="ricettario-card-body">
                      <div className="d-flex title-btn-card">
                        <Card.Title className="ricettario-card-title">
                          {ricettario.nome}
                        </Card.Title>

                        <Button
                 
                          className="ricettario-elimina-btn"
                          onClick={() => confirmDeleteRicettario(ricettario.id)}
                        >
                       <FaTrashAlt/>
                        </Button>
                      </div>
                    </Card.Body>
                  </div>
                </Card>
              </Col>
            ))
          ) : (
            <Alert className="alert-custom">
              Nessun ricettario trovato. Vuoi crearne uno?
            </Alert>
          )}
        </Row>

        {/* Modal per confermare il delete*/}
        <Modal
          className="elimina_ricettario_modal"
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
        >
          <div className="modale">
            <Modal.Header closeButton>
              <Modal.Title>Conferma Eliminazione</Modal.Title>
            </Modal.Header>
            <Modal.Body className="mod-label">
              Sei sicuro di voler eliminare questo ricettario? Questa operazione
              non può essere annullata.
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="eliminaRicetta-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Annulla
              </Button>
              <Button
                className="btn-danger eliminaRicetta-conferma"
                onClick={handleDeleteRicettario}
              >
                Conferma Eliminazione
              </Button>
            </Modal.Footer>
          </div>
        </Modal>

        {/* Modal per  nuovo ricettario */}
        <Modal
          className="crea_ricettario_modal"
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
        >
          <div className="modale">
            <Modal.Header closeButton>
              <Modal.Title>Crea Ricettario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label className="mod-label">Nome Ricettario</Form.Label>
                <Form.Control
                  type="text"
                  value={ricettarioName}
                  onChange={(e) => setRicettarioName(e.target.value)}
                  placeholder="Inserisci il nome del ricettario"
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
              <Button
                className="creaRicetta-btn px-4 py-0"
                onClick={handleCreateRicettario}
              >
                Crea
              </Button>
              <Button
                className="chiudi-btn px-3 py-3"
                onClick={() => setShowCreateModal(false)}
              >
                Chiudi
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
      </Container>
    </div>
  );
};

export default Ricettario;
