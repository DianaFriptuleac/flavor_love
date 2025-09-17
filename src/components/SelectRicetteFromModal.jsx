import { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addRicettaToRicettario } from "../redux/actions/ricettarioActions";

const SelectRicetteFromModal = ({ show, onHide, ricettaId }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const ricettari = useSelector((state) => state.ricettari.list);
  const [newRicettarioName, setNewRicettarioName] = useState("");
  const [error, setError] = useState("");

  const handleAddToRicettario = async (ricettarioId) => {
    try {
      const response = await fetch(
        `https://capstone-flavor-love-1.onrender.com/api/ricettari/${ricettarioId}/ricette/${ricettaId}`,
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

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Seleziona un Ricettario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {Array.isArray(ricettari) && ricettari.length > 0 ? (
          ricettari.map((ricettario) => (
            <Button
              key={ricettario.id}
              className="w-100 mb-2"
              onClick={() => handleAddToRicettario(ricettario.id)}
            >
              {ricettario.nome}
            </Button>
          ))
        ) : (
          <Alert variant="info">
            Nessun ricettario creato. Vuoi crearne uno?
          </Alert>
        )}
        <Form className="mt-3">
          <Form.Group>
            <Form.Label>Nome nuovo ricettario</Form.Label>
            <Form.Control
              type="text"
              placeholder="Inserisci nome ricettario"
              value={newRicettarioName}
              onChange={(e) => setNewRicettarioName(e.target.value)}
            />
          </Form.Group>
          <Button
            className="mt-2"
            onClick={() => console.log("Crea nuovo ricettario")}
          >
            Crea Ricettario
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Chiudi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SelectRicetteFromModal;
