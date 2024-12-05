import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Form, ListGroup, Alert } from "react-bootstrap";
import { setRicettari, addRicettario, removeRicettario } from "../redux/actions/ricettarioActions";
import { useNavigate } from "react-router-dom";

const Ricettario = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const ricettari = useSelector((state) => state.ricettari.list); 
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [ricettarioName, setRicettarioName] = useState("");
  const [alert, setAlert] = useState("");
  const navigate = useNavigate();



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

 /* //Add ricetta al ricettario
  const handleAddToRicettario = async (ricettarioId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/ricettari/${ricettarioId}/ricette/${ricettaId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        dispatch(addRicettaToRicettario(ricettarioId, ricettaId));
        onHide();
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Errore nell'aggiunta della ricetta");
      }
    } catch (err) {
      console.error("Errore:", err.message);
      setError(err.message);
    }
  };
*/
    // Fetch -> get ricettario con ricette
  /*  const fetchRicettarioConRicette = async (ricettarioId, page = 0, size = 10) => {
      try {
        const response = await fetch(`http://localhost:3001/api/ricettari/${ricettarioId}?page=${page}&size=${size}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("RICETTARIO:", data.ricetta.content);

          setSelectedRicettario(data);
          setRicette(data.ricetta?.content || []);
          setTotalPages(data.ricetta.totalPages || 0);
          setCurrentPage(data.ricetta.number || 0);
        }
      } catch (error) {
        console.error("Errore nel fetch del ricettario:", error.message);
      }
    };
  */

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

  useEffect(() => {
    fetchRicettari();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, token]); 

return (
  <div>
    <h2>I miei Ricettari</h2>
    <ListGroup className="mt-4">
      {Array.isArray(ricettari) && ricettari.length > 0 ? (
        ricettari.map((ricettario) => (
          <ListGroup.Item key={ricettario.id} className="d-flex justify-content-between">
            <span>{ricettario.nome}</span>
            <div>
              <Button
                variant="info"
                className="me-2"
                onClick={() => navigate(`/ricettari/${ricettario.id}`)}
              >
                Visualizza
              </Button>
              <Button variant="danger" onClick={() => handleDeleteRicettario(ricettario.id)}>
                Elimina
              </Button>
            </div>
          </ListGroup.Item>
        ))
      ) : (
        <Alert variant="info">Nessun ricettario trovato. Vuoi crearne uno?</Alert>
      )}
    </ListGroup>
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
