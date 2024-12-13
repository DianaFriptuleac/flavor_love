import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRicette } from "../redux/actions/fetchRicetteAction";
import {
  setRicettari,
  addRicettario,
} from "../redux/actions/ricettarioActions";
import {
  Container,
  Card,
  Row,
  Col,
  Alert,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Pagination } from "react-bootstrap";
import "../css/AllRicette.css";
<css></css>;

const AllRicette = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ricette, totalPages, currentPage } = useSelector(
    (state) => state.ricette
  );
  const ricettari = useSelector((state) => state.ricettari.list);
  const token = useSelector((state) => state.auth.token);

  const [selectedRicetta, setSelectedRicetta] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newRicettarioName, setNewRicettarioName] = useState("");

  useEffect(() => {
    dispatch(fetchRicette(0)); // Fetch della prima pagina
  }, [dispatch]);

  //get ricettari
  const fetchRicettari = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/ricettari", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(setRicettari(data.content));
      } else {
        console.error("Errore nel recupero dei ricettari");
      }
    } catch (err) {
      console.error("Errore:", err.message);
    }
  };

  const handleOpenModal = (ricetta) => {
    setSelectedRicetta(ricetta);
    fetchRicettari(); //recupero i ricettari
    setShowModal(true);
  };

  const handlePageChange = (page) => {
    dispatch(fetchRicette(page));
  };

  // agg. ricetta al ricettario
  const handleAddToRicettario = async (ricettarioId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/ricettari/${ricettarioId}/ricette/${selectedRicetta.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setShowModal(false);
        setSelectedRicetta(null);
        alert("Ricetta aggiunta al ricettario con successo!");
      } else {
        alert("Errore nell'aggiunta della ricetta al ricettario.");
      }
    } catch (err) {
      console.error("Errore:", err.message);
    }
  };

  // crea ricettario
  const handleCreateRicettario = async () => {
    if (!newRicettarioName.trim()) {
      alert("Il nome del ricettario non può essere vuoto.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/ricettari", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome: newRicettarioName }),
      });

      if (response.ok) {
        const newRicettario = await response.json();
        dispatch(addRicettario(newRicettario));
        setNewRicettarioName("");
        alert("Ricettario creato con successo!");
      } else {
        alert("Errore nella creazione del ricettario.");
      }
    } catch (err) {
      console.error("Errore:", err.message);
    }
  };

  return (
    <div className="bg-Allricette">
      <Container>
        <h2 className="mt-4 title-AllRicette">Scopri tutte le ricette</h2>
        <Row className="mt-3">
          {Array.isArray(ricette) && ricette.length > 0 ? (
            ricette.map((ricetta) => (
              <Col key={ricetta.id} md={6} lg={4} xl={3} className="mb-4">
                <Card className="allRicette-card">
                  <div className="heartContainer">
                  <Button
                      className="heart-btn"
                      variant="outline-danger"
                      onClick={() => handleOpenModal(ricetta)}
                    >
                      ❤️
                    </Button>
                  </div>
                  <Card.Img
                    onClick={() => navigate(`/ricette/${ricetta.id}`)}
                    className="cursor-pointer AllRicette-card-img"
                    variant="top"
                    src={
                      ricetta.img && ricetta.img.length > 0
                        ? ricetta.img[0].url
                        : "/assets/default_ricetta.jpg"
                    }
                    alt={ricetta.titolo}
                  />
                  <Card.Body className="custom-card-body p-2">
                    <Card.Title className="card-Title text-light mb-0">
                      {ricetta.titolo}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Alert variant="info">Nessuna ricetta trovata.</Alert>
          )}
        </Row>
        <Pagination className="justify-content-center mt-4 allRicette-pagination">
          {totalPages > 0 &&
            [...Array(totalPages).keys()].map((page) => (
              <Pagination.Item
                key={page}
                className="pagination-item"
                active={page === currentPage}
                onClick={() => handlePageChange(page)}
              >
                {page + 1}
              </Pagination.Item>
            ))}
        </Pagination>
        {/* Seleziono o creo un ricettario */}
        <Modal
          className="AllRicette-Modal"
          show={showModal}
          onHide={() => setShowModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title className="modal-title">
              Aggiungi a un Ricettario
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            {Array.isArray(ricettari) && ricettari.length > 0 ? (
              <>
                <h5>Seleziona un ricettario:</h5>
                {ricettari.map((ricettario) => (
                  <Button
                    key={ricettario.id}
                    className="w-100 mb-2 ricettari-btn"
                    onClick={() => handleAddToRicettario(ricettario.id)}
                  >
                    {ricettario.nome}
                  </Button>
                ))}
              </>
            ) : (
              <Alert variant="info" className="modal-alert">
                Nessun ricettario trovato. Vuoi crearne uno?
              </Alert>
            )}
            <h5 className="mt-4">Crea un nuovo ricettario:</h5>
            <Form>
              <Form.Group>
                <Form.Label className="form-modal-label">
                  Nome del Ricettario
                </Form.Label>
                <Form.Control
                  className="form-modal-control"
                  type="text"
                  value={newRicettarioName}
                  onChange={(e) => setNewRicettarioName(e.target.value)}
                />
              </Form.Group>
              <Button
                className="mt-3 modal-btn"
                variant="primary"
                onClick={handleCreateRicettario}
              >
                Crea
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer className="modal-footer">
            <Button
              variant="secondary"
              className="modal-btn"
              onClick={() => setShowModal(false)}
            >
              Chiudi
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AllRicette;
