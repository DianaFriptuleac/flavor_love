import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Form, ListGroup } from "react-bootstrap";
import { setRicettari, addRicettario, removeRicettario } from "../redux/actions/ricettarioActions";
import { Pagination } from "react-bootstrap";

const Ricettario = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const ricettari = useSelector((state) => state.ricettari.list); 
  const [selectedRicettario, setSelectedRicettario] = useState(null);
  const [ricette, setRicette] = useState([]); 
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [ricettarioName, setRicettarioName] = useState("");
  const [alert, setAlert] = useState("");



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

    // Fetch -> get ricettario con ricette
    const fetchRicettarioConRicette = async (ricettarioId, page = 0, size = 10) => {
      try {
        const response = await fetch(`http://localhost:3001/api/ricettari/${ricettarioId}?page=${page}&size=${size}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Ricettario con ricette:", data);
          setSelectedRicettario(data);
          setRicette(data.ricette.content);
          setTotalPages(data.ricette.totalPages);
          setCurrentPage(data.ricette.number);
        }
      } catch (error) {
        console.error("Errore nel fetch del ricettario:", error.message);
      }
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
      const response = await fetch(`http://localhost:3001/api/ricettari/${ricettarioId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        dispatch(removeRicettario(ricettarioId)); 
      }
    } catch (error) {
      console.error("Errore nella cancellazione:", error.message);
    }
  };

  const handlePageChange = (page) => {
    if (selectedRicettario) {
      fetchRicettarioConRicette(selectedRicettario.id, page);
    }
  };
  
  useEffect(() => {
    fetchRicettari();
  }, []); 

  return (
    <div>
      <h2>I miei Ricettari</h2>
      <ListGroup className="mt-4">
        {Array.isArray(ricettari) && ricettari.length > 0 ? (
          ricettari.map((ricettario) => (
            <ListGroup.Item key={ricettario.id} className="d-flex justify-content-between">
              <span>{ricettario.nome}</span>
              <Button variant="danger" onClick={() => handleDeleteRicettario(ricettario.id)}>
                Elimina
              </Button>
            </ListGroup.Item>
          ))
        ) : (
          <p>Nessun ricettario trovato.</p>
        )}
      </ListGroup>
      {selectedRicettario && (
        <div>
          <h3>Ricette nel Ricettario: {selectedRicettario.nome}</h3>
          <ListGroup>
            {ricette.map((ricetta) => (
              <ListGroup.Item key={ricetta.id}>
                <strong>{ricetta.titolo}</strong>
                {ricetta.immagineUrl && <img src={ricetta.immagineUrl} alt={ricetta.titolo} style={{ width: "100px", marginLeft: "10px" }} />}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Pagination>
            {[...Array(totalPages).keys()].map((page) => (
              <Pagination.Item key={page} active={page === currentPage} onClick={() => handlePageChange(page)}>
                {page + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}
      {/* Modale per ricettario */}
      <Button variant="primary" className="mt-3" onClick={() => setShowCreateModal(true)}>
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
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Chiudi
          </Button>
          <Button variant="primary" onClick={handleCreateRicettario}>
            Crea
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Ricettario;

