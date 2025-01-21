import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addRecensione,
  removeRecensione,
  setRecensioni,
  updateRecensione,
} from "../redux/actions/recensioniActions";
import { Spinner, Button, Modal, Form } from "react-bootstrap";
import { FaStar, FaEdit, FaTrashAlt } from "react-icons/fa";

const Recensioni = ({ ricettaId }) => {
  const dispatch = useDispatch();
  const recensioni = useSelector(
    (state) => state.recensioni.recensioniPerRicetta?.[ricettaId] || []
  );
  console.log("RECENSIONI STATE", recensioni);
  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.user?.id);
  console.log("Utente autenticato:", userId);

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecensione, setselectedRecensione] = useState(null);
  const [formData, setFormData] = useState({ stelle: 1, commento: "" });

  useEffect(() => {
    //recupero le recensioni
    const fetchRecensioni = async () => {
      setLoading(true);

      try {
        console.log("Fetching recensioni x ricettaId:", ricettaId);
        const response = await fetch(
          `http://localhost:3001/api/recensioni/ricette/${ricettaId}?page=0&size=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok)
          if (response.status === 404) {
            throw new Error(
              `Nessuna recensione trovata per la ricetta con ID ${ricettaId}`
            );
          } else {
            throw new Error("Errore nel caricamento delle recensioni!");
          }
        const data = await response.json();
        console.log(" GET RECENSIONI", data);
        dispatch(setRecensioni(ricettaId, data.content));
      } catch (err) {
        console.log("Errore nella chaiamta ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecensioni();
  }, [ricettaId, dispatch, token]);

  //apro il modale x creare recensione o modificare
  const handleOpenModal = (recensione = null) => {
    setselectedRecensione(recensione);
    setFormData(
      recensione
        ? { stelle: recensione.stelle, commento: recensione.commento }
        : { stelle: 1, commento: "" }
    );
    setShowModal(true);
  };
  //chiudo modale
  const handleCloseModal = () => setShowModal(false);

  //cambio recensione
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // submit x creo o modifico
  const handleSubmit = async () => {
    const method = selectedRecensione ? "PUT" : "POST";
    const url = selectedRecensione
      ? `http://localhost:3001/api/recensioni/${selectedRecensione.id}`
      : `http://localhost:3001/api/recensioni/ricette/${ricettaId}`;

    try {
      const responce = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!responce.ok) throw new Error("Errore durante il salvataggio!");
      const data = await responce.json();
      if (selectedRecensione) {
        dispatch(updateRecensione(ricettaId, data)); //modifico la recensione
      } else {
        dispatch(addRecensione(ricettaId, data)); //aggiungo recensione
      }
      handleCloseModal();
    } catch (err) {
      console.log("Errore", err);
    }
  };

  //cancello recensione
  const handleDelete = async (id) => {
    try {
      const responce = await fetch(
        `http://localhost:3001/api/recensioni/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!responce.ok)
        throw new Error("Errore durante la cancellazione della recensione!");
      dispatch(removeRecensione(ricettaId, id));
    } catch (err) {
      console.log("Errore", err);
    }
  };

  return (
    <div>
      <h2 className="fw-bold ms-1">Recensioni:</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : recensioni.length === 0 ? (
        <p>
          Non ci sono ancora recensioni per questa ricetta... Sii il primo a
          lasciarne una!
        </p>
      ) : (
        <div>
          {recensioni.map((recensione) => (
            <div key={recensione.id} className="my-3 p-3 border rounded">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  {Array.from({ length: 5 }, (_, index) => (
                    <FaStar
                      key={index}
                      color={index < recensione.stelle ? "gold" : "gray"}
                      style={{ marginRight: 5 }}
                    />
                  ))}
                </div>
                {/*btn x modifica e cancella solo se create dall'utente logato */}
                {recensione.utente.id === userId && (
                  <div className="d-flex">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleOpenModal(recensione)}
                      className="d-flex align-itens-center p-2 recensioni-btn-edit"
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(recensione.id)}
                      className="ms-2 d-flex align-itens-center p-2 recensioni-btn-trash"
                    >
                      <FaTrashAlt />
                    </Button>
                  </div>
                )}
              </div>
              <p className="mt-2">{recensione.commento}</p>
              <small className="text-muted">
                Data: {new Date(recensione.dataCreazione).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}

      <Button onClick={() => handleOpenModal()} className="salva-btn">
        Aggiungi Recensione
      </Button>

      <Modal
        className="AllRicette-Modal"
        show={showModal}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedRecensione ? "Modifica Recensione" : "Nuova Recensione"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formStelle">
              <Form.Label>Numero di Stelle</Form.Label>
              <div>
                {Array.from({ length: 5 }, (_, index) => {
                  const isFullStar = formData.stelle >= index + 1;
                  const isHalfStar =
                    formData.stelle > index && formData.stelle < index + 1;

                  return (
                    <FaStar
                      key={index}
                      color={
                        isFullStar ? "gold" : isHalfStar ? "goldenrod" : "gray"
                      }
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          stelle: index + 1,
                        }))
                      }
                      style={{
                        cursor: "pointer",
                        marginRight: 5,
                        clipPath: isHalfStar
                          ? "polygon(0 0, 50% 0, 50% 100%, 0 100%)"
                          : "none",
                      }}
                    />
                  );
                })}
              </div>
            </Form.Group>
            <Form.Group controlId="formCommento" className="mt-3">
              <Form.Label>Commento</Form.Label>
              <Form.Control
                as="textarea"
                className="recensioniFocus"
                rows={3}
                name="commento"
                value={formData.commento}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="rimuovi-btn"
            variant="secondary"
            onClick={handleCloseModal}
          >
            Annulla
          </Button>
          <Button className="tornaBtn" variant="primary" onClick={handleSubmit}>
            Salva
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Recensioni;
