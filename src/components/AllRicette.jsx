import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRicette } from "../redux/actions/fetchRicetteAction";
import { setRicettari, addRicettario } from "../redux/actions/ricettarioActions";
import { Container, Card, Row, Col, Alert, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Pagination } from "react-bootstrap";

const AllRicette = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { ricette, totalPages, currentPage } = useSelector((state) => state.ricette);
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

    // agg. ricetta all ricettario
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
      <Container>
        <h2 className="mt-4">Tutte le Ricette</h2>
        <Row className="mt-3">
          {Array.isArray(ricette) && ricette.length > 0 ? (
            ricette.map((ricetta) => (
              <Col key={ricetta.id} md={4} className="mb-4">
                <Card >
                  <Card.Img
                  onClick={() => navigate(`/ricette/${ricetta.id}`)} className="cursor-pointer"
                    variant="top"
                    src={
                      ricetta.img && ricetta.img.length > 0
                        ? ricetta.img[0].url
                        : "/assets/default_ricetta.jpg"
                    }
                    alt={ricetta.titolo}
                  />
                  <Card.Body>
                    <Card.Title>{ricetta.titolo}</Card.Title>
                    <Button
                    variant="outline-danger"
                    onClick={() => handleOpenModal(ricetta)} 
                  >
                    ❤️
                  </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Alert variant="info">Nessuna ricetta trovata.</Alert>
          )}
        </Row>
        <Pagination className="justify-content-center mt-4">
          {totalPages > 0 &&
            [...Array(totalPages).keys()].map((page) => (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => handlePageChange(page)}
              >
                {page + 1}
              </Pagination.Item>
            ))}
        </Pagination>
          {/* Seleziono o creo un ricettario */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Aggiungi a un Ricettario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Array.isArray(ricettari) && ricettari.length > 0 ? (
            <>
              <h5>Seleziona un ricettario:</h5>
              {ricettari.map((ricettario) => (
                <Button
                  key={ricettario.id}
                  className="w-100 mb-2"
                  onClick={() => handleAddToRicettario(ricettario.id)}
                >
                  {ricettario.nome}
                </Button>
              ))}
            </>
          ) : (
            <Alert variant="info">
              Nessun ricettario trovato. Vuoi crearne uno?
            </Alert>
          )}
          <h5 className="mt-4">Crea un nuovo ricettario:</h5>
          <Form>
            <Form.Group>
              <Form.Label>Nome del Ricettario</Form.Label>
              <Form.Control
                type="text"
                value={newRicettarioName}
                onChange={(e) => setNewRicettarioName(e.target.value)}
              />
            </Form.Group>
            <Button
              className="mt-3"
              variant="primary"
              onClick={handleCreateRicettario}
            >
              Crea
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
      </Container>
    );
  };
  
  export default AllRicette;