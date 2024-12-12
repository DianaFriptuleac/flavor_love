import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Button,
  Form,
  Modal,
  Alert,
} from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import "../css/ListaSpesa.css";

const ListaSpesa = () => {
  const token = useSelector((state) => state.auth.token);
  const [listaSpesa, setListaSpesa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingIngrediente, setEditingIngrediente] = useState(null);
  const [dosaggio, setDosaggio] = useState(0);
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
        console.log("LISTA SPESA", data);
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
      const response = await fetch(
        `http://localhost:3001/api/lista-spesa/ingrediente/${ingredienteId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  // Modifico dosaggio ingrediente
  const handleUpdateDosaggio = async () => {
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
            dosaggio: dosaggio, 
            unita: editingIngrediente.unita,
          }),
        }
      );

      if (response.ok) {
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
      const response = await fetch(
        "http://localhost:3001/api/lista-spesa/clear",
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

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

  if (loading)
    return <Alert variant="success">Caricamento della lista della spesa...</Alert>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="bg-listaSpesa">
      <Container className="listaContainer">
        <Row>
          <Col
            md={6}
            className="d-flex justify-content-between align-items-center"
          >
            <div>
              <h1 className="mt-4 titoloLista">Lista Spesa</h1>
            </div>
            <div>
              <Button className="svuota-lista" onClick={handleClearListaSpesa}>
                Svuota Lista Spesa
              </Button>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <ListGroup>
              {listaSpesa?.elements?.map((ingrediente) => (
                <ListGroup.Item
                  key={ingrediente.id}
                  className="list-group-listaSp mt-2 d-flex justify-content-between align-items-center"
                >
                  <span className="text-lista">
                    {ingrediente.nome} - {ingrediente.dosaggio}{" "}
                    {ingrediente.unita}
                  </span>
                  <div className="d-flex">
                    <Button
                      className="me-2 modifica-lista-btn d-flex align-items-center "
                      onClick={() => {
                        setEditingIngrediente(ingrediente);
                        setDosaggio(ingrediente.dosaggio);
                        setShowModal(true);
                      }}
                    >
                      <FaEdit className="fw-bold" />
                    </Button>
                    <Button
                      className="remove-lista-btn"
                      onClick={() => handleRemoveIngrediente(ingrediente.id)}
                    >
                      <FaTrashAlt />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>

            {/* Modale per modificare il dosaggio ingredienti */}
            <Modal className="modalLista" show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Modifica Quantità</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group>
                  <Form.Label>Quantità</Form.Label>
                  <Form.Control
                    type="number"
                    value={dosaggio}
                    onChange={(e) => setDosaggio(e.target.value)}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Annulla
                </Button>
                <Button variant="primary" onClick={handleUpdateDosaggio}>
                  Salva
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ListaSpesa;
