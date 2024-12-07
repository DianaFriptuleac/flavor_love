import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container, ListGroup, Button, Form, Modal, Alert } from "react-bootstrap";

const ListaSpesa = () => {
  const token = useSelector((state) => state.auth.token); 
  const [listaSpesa, setListaSpesa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingIngrediente, setEditingIngrediente] = useState(null);
  const [quantita, setQuantita] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Fetch lista spesa
  const fetchListaSpesa = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/lista-spesa", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("LISTA SPESA", data)
        setListaSpesa(data);
      } else {
        throw new Error("Errore nel recupero della lista spesa.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete ingrediente
  const handleRemoveIngrediente = async (ingredienteId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/lista-spesa/ingrediente/${ingredienteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert("Ingrediente rimosso con successo!");
        fetchListaSpesa();
      } else {
        throw new Error("Errore nella rimozione dell'ingrediente.");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Modifico quantita ingrediente
  const handleUpdateQuantita = async () => {
    if (!editingIngrediente) return;
  
    try {
      const response = await fetch(
        `http://localhost:3001/api/lista-spesa/ingrediente/${editingIngrediente.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingIngrediente.id, 
            nome: editingIngrediente.nome, 
            quantita: quantita, 
            unita: editingIngrediente.unita, 
            dosaggio: editingIngrediente.dosaggio, 
          }),
        }
      );
  
      if (response.ok) {
        alert("Quantità aggiornata con successo!");
        setShowModal(false);
        fetchListaSpesa(); 
      } else {
        throw new Error("Errore nell'aggiornamento della quantità.");
      }
    } catch (err) {
      console.error(err.message);
    }
  };


  //svuota lista spesa
  const handleClearListaSpesa = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/lista-spesa/clear", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert("Lista spesa svuotata con successo!");
        fetchListaSpesa(); // Aggiorno lista spesa
      } else {
        throw new Error("Errore nello svuotamento della lista spesa.");
      }
    } catch (err) {
      console.error(err.message);
    }
  };
  
  useEffect(() => {
    fetchListaSpesa();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Alert variant="info">Caricamento della lista della spesa...</Alert>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container>
      <h1 className="mt-4">La Mia Lista Spesa</h1>
      <Button variant="danger" className="mb-3" onClick={handleClearListaSpesa}>
        Svuota Lista Spesa
      </Button>
      <ListGroup>
        {listaSpesa?.elements?.map((ingrediente) => (
          <ListGroup.Item key={ingrediente.id} className="d-flex justify-content-between align-items-center">
            <span>
              {ingrediente.nome} - {ingrediente.quantita} {ingrediente.unita}
            </span>
            <div>
              <Button
                variant="warning"
                className="me-2"
                onClick={() => {
                  setEditingIngrediente(ingrediente);
                  setQuantita(ingrediente.quantita);
                  setShowModal(true);
                }}
              >
                Modifica
              </Button>
              <Button variant="danger" onClick={() => handleRemoveIngrediente(ingrediente.id)}>
                Rimuovi
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Modale per modificare la quantita ingredienti */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Quantità</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Quantità</Form.Label>
            <Form.Control
              type="number"
              value={quantita}
              onChange={(e) => setQuantita(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annulla
          </Button>
          <Button variant="primary" onClick={handleUpdateQuantita}>
            Salva
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListaSpesa;
