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
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardText,
} from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "../css/Ristoranti.css";

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
    categorie: "",
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
        categorie: "",
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
    <div className="bg-ristoranti">
      <Container className="mt-3">
        {" "}
        <Row>
          {" "}
          <Col className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="my-4 title-AllRicette">
                Esplora la Nostra Selezione di Ristoranti
              </h2>
            </div>
            <div>
              <Button onClick={() => handleOpenModal()} className="salva-btn">
                Aggiungi Ristorante
              </Button>
            </div>
          </Col>
        </Row>
        <Modal
          className="AllRicette-Modal"
          show={showModal}
          onHide={handleCloseModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedRistorante ? "Modifica Ristorante" : "Nuovo Ristorante"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {[
                "nome",
                "indirizzo",
                "citta",
                "categorie",
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
            <Button  className="rimuovi-btn" onClick={handleCloseModal}>
              Annulla
            </Button>
            <Button className="tornaBtn" onClick={handleSubmit}>
              Salva
            </Button>
          </Modal.Footer>
        </Modal>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Row className="g-3">
            {ristoranti.map((ristorante) => (
              <Col key={ristorante.id} sm={12} md={4} lg={3}>
                <Card className="p-2 ristorantiCard">
                  <CardImg
                  className="ristorantiImg"
                    variant="top"
                    src={ristorante.immagine}
                    alt={ristorante.nome}
                  />
                  <CardBody className="ristorantiCardBody">
                    <CardTitle> <strong>{ristorante.nome}</strong></CardTitle>
                    <CardText>
                      <strong>Indirizzo:</strong> {ristorante.indirizzo}
                    </CardText>
                    <CardText>
                      <strong>Città:</strong> {ristorante.citta}
                    </CardText>
                    <CardText>
                      <strong>Categoria:</strong> {ristorante.categorie}
                    </CardText>
                    <CardText>
                      <strong>Telefono:</strong> {ristorante.telefono}
                    </CardText>
                    <CardText className="pb-2">
                      <strong>Scopri di più:</strong>{" "}
                      <a
                        href={ristorante.link}
                        target="_blank" //apri in un'altra pagina
                        rel="noopener noreferrer" //non accedere alla pagina originale e nasconde  l'URL della pag. corrente alla pag. aperta
                      >
                        {ristorante.link}
                      </a>
                    </CardText>

                    <div>
                      {(ristorante.utente.id === userId ||
                        userId === "ADMIN") && (
                        <div className="d-flex justify-content-between mb-2">
                         
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleOpenModal(ristorante)}
                             className="d-flex align-itens-center p-2 recensioni-btn-edit"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(ristorante.id)}
                            className="d-flex align-itens-center p-2 recensioni-btn-trash"
                          >
                            <FaTrashAlt />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Ristoranti;
