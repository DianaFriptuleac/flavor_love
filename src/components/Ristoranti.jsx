import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addRistoranteAction,
  removeRistoranteAction,
  setRistorantiAction,
  updateRistoranteAction,
} from "../redux/actions/ristoranteAction";
import {
  Spinner,
  Modal,
  Button,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const Ristoranti = () => {
  const dispatch = useDispatch();
  const ristoranti = useSelector((state) => state.ristoranti.ristoranti);
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user?.id);

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRistorante, setSelectedRistorante] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    indirizzo: "",
    citta: "",
    categoria: "",
    telefono: "",
    link: "",
    immagine: "",
  });

  useEffect(() => {
    //recupero i ristoranti
    const fetchRistoranti = async () => {
      setLoading(true);
      try {
        const responce = await fetch("http://localhost:3001/api/ristoranti", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await responce.json();
        console.log("RISTORANTI DATA", data);
        dispatch(setRistorantiAction(data.content));
      } catch (err) {
        console.log("Errore nel caricamento dei ristoranti!", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRistoranti();
  }, [dispatch, token]);

  //apro modale per agg. o modificare ristorante
  const handleOpenModal = (ristorante = null) => {
    setSelectedRistorante(ristorante);
    setFormData(
      ristorante || {
        nome: "",
        indirizzo: "",
        citta: "",
        categoria: "",
        telefono: "",
        link: "",
        immagine: "",
      }
    );
    setShowModal(true);
  };

  //chiudo il modale
  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const method = selectedRistorante ? "PUT" : "POST";
    const url = selectedRistorante
      ? `http://localhost:3001/api/ristoranti/${selectedRistorante.id}`
      : "http://localhost:3001/api/ristoranti/crea";

    try {
      const responce = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await responce.json();
      if (selectedRistorante) {
        dispatch(updateRistoranteAction(data)); //modifica del ristorante
      } else {
        dispatch(addRistoranteAction(data)); //aggiungo ristorante
      }
      handleCloseModal();
    } catch (err) {
      console.log("Errore durante il salvataggio del ristorante!", err);
    }
  };

  //cancello ristorante
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/ristoranti/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(removeRistoranteAction(id));
    } catch (err) {
      console.log("Errore durante la cancellazione del ristorante", err);
    }
  };
  return (
    <div>
      <Container>
        {" "}
        <Row className="justify-content-center g-3">
          {" "}
          <Col>
            <h2 className="fw-bold">Ristoranti</h2>
            {loading ? (
              <Spinner animation="border" />
            ) : (
              <div className="d-flex ">
                {ristoranti.map((ristorante) => (
                  <div key={ristorante.id} className="my-3 p-3 border rounded">
                    <div>
                      <h5>{ristorante.nome}</h5>
                      <img
                        src={ristorante.immagine}
                        alt={ristorante.nome}
                        style={{
                          width: "100%",
                          maxHeight: "200px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div>
                      <p>
                        <strong>Indirizzo:</strong> {ristorante.indirizzo}
                      </p>
                      <p>
                        <strong>Città:</strong> {ristorante.citta}
                      </p>
                      <p>
                        <strong>Categoria:</strong> {ristorante.categorie}
                      </p>
                      <p>
                        <strong>Telefono:</strong> {ristorante.telefono}
                      </p>
                      <p>
                        <strong>Link:</strong>{" "}
                        <a
                          href={ristorante.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {ristorante.link}
                        </a>
                      </p>
                    </div>
                    <div className="d-flex mt-2">
                      {(ristorante.utente.id === userId ||
                        userId === "ADMIN") && (
                        <>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleOpenModal(ristorante)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(ristorante.id)}
                            className="ms-2"
                          >
                            <FaTrashAlt />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button onClick={() => handleOpenModal()} className="mt-3">
              Aggiungi Ristorante
            </Button>

            <Modal
              className="AllRicette-Modal"
              show={showModal}
              onHide={handleCloseModal}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  {selectedRistorante
                    ? "Modifica Ristorante"
                    : "Nuovo Ristorante"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  {[
                    "nome",
                    "indirizzo",
                    "citta",
                    "categoria",
                    "telefono",
                    "link",
                    "immagine",
                  ].map((field) => (
                    <Form.Group key={field} className="mb-3">
                      <Form.Label>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  ))}
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Annulla
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
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

export default Ristoranti;
