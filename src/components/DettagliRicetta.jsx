import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDettagliRicetta } from "../redux/actions/fetchRicetteAction";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  ListGroup,
} from "react-bootstrap";
import { useState } from "react";
import { FaRegClock, FaTrashAlt, FaEdit, FaShoppingCart } from "react-icons/fa";
import { PiCookingPotDuotone } from "react-icons/pi";
import { HiOutlineCurrencyEuro } from "react-icons/hi2";
import { TbChefHat } from "react-icons/tb";

import "../css/DettagliRicetta.css";

const DettagliRicetta = () => {
  const { id } = useParams(); // ottengo id ricetta
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { dettagli, loading, error } = useSelector((state) => state.ricette);
  const userId = useSelector((state) => state.auth.user?.id); //id utente
  const token = useSelector((state) => state.auth.token); // token
  const [notification, setNotification] = useState({
    message: "",
    variant: "",
  });

  const handleDelete = async () => {
    const confermaDelete = window.confirm(
      "Sei sicuro di voler cancellare questa ricetta?"
    );
    if (!confermaDelete) return;
    try {
      const response = await fetch(`http://localhost:3001/api/ricette/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotification({
          message: "Ricetta cancellata con successo.",
          variant: "success",
        });

        navigate("/userprofile");
      } else {
        throw new Error("Errore nella cancellazione della ricetta");
      }
    } catch (error) {
      console.error("Errore:", error.message);
      setNotification({
        message: "Errore nella cancellazione della ricetta.",
        variant: "danger",
      });
    }
  };

  //aggiungo ricetta alla lista spesa
  const aggiungiAllaListaSpesa = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/lista-spesa/${id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        setNotification({
          message: "Ingredienti aggiunti alla lista della spesa!",
          variant: "success",
        });
        navigate("/listaSpesa");
      } else {
        throw new Error("Errore nell'aggiunta degli ingredienti.");
      }
    } catch (err) {
      console.error(err.message);
      setNotification({
        message: "Errore nell'aggiunta degli ingredienti.",
        variant: "danger",
      });
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchDettagliRicetta(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <Alert variant="danger">Caricamento dettagli ricetta...</Alert>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!dettagli) {
    return <Alert variant="info">Nessuna ricetta trovata.</Alert>;
  }

  // Raggruppo ingredienti per sezione
  const ingredientiPerSezione = dettagli.ingredienti?.reduce((acc, ing) => {
    if (!acc[ing.sezione]) {
      acc[ing.sezione] = [];
    }
    acc[ing.sezione].push(ing);
    return acc;
  }, {});

  return (
    <div className="bg-dettagliRicetta">
      <Container className="dettagli-ricetta">
      <Container>
        {notification.message && (
          <Alert variant={notification.variant}>{notification.message}</Alert>
        )}

        <Row>
          {/* Img. /Titolo */}
          <Col md={6}>
            <Card className="shadow-sm border-0">
              <Card.Img
                variant="top"
                src={dettagli.img?.[0]?.url || "/assets/default_ricetta.jpg"}
                alt={dettagli.titolo}
                className="rounded"
              />
            </Card>
          </Col>
          <Col md={6} className="mt-2">
            <Card className="shadow-sm border-0 p-3">
              <Card.Body>
                <Card.Title className="titleCard display-6">
                  {dettagli.titolo}
                </Card.Title>

                <ListGroup className="list-unstyled">
                  <li className="d-flex align-items-center">
                    <FaRegClock className="me-3" />
                    <strong>Preparazione:</strong>{" "}
                    {dettagli.tempoPreparazioneMinuti} min
                  </li>
                  <li className="d-flex align-items-center">
                    <PiCookingPotDuotone className="me-3 " />
                    <strong>Cottura:</strong> {dettagli.tempoCotturaMinuti} min
                  </li>
                  <li className="d-flex align-items-center">
                    <TbChefHat className="me-3" />
                    <strong>Difficoltà:</strong> {dettagli.difficoltaRicetta}
                  </li>
                  <li className="d-flex align-items-center">
                    <HiOutlineCurrencyEuro className="me-3" />
                    <strong>Costo:</strong> {dettagli.costoRicetta}
                  </li>
                </ListGroup>
                {dettagli.utente?.id === userId && (
                  <div className="mt-3 btn-container">
                    <Button
                      className="me-3 modifica-ricetta-btn d-flex align-items-center"
                      onClick={() => navigate(`/ricette/${id}/update`)}
                    >
                      <FaEdit className="me-1" /> Modifica
                    </Button>
                    <Button
                      className="me-3 elimina-ricetta-btn d-flex align-items-center"
                      onClick={handleDelete}
                    >
                      <FaTrashAlt className="me-1" /> Elimina
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row></Row>

        <Row className="mt-4">
          <Col>
            <h2 className="fw-bold ms-1">Ingredienti:</h2>
            {ingredientiPerSezione &&
              Object.entries(ingredientiPerSezione).map(
                ([sezione, ingredienti]) => (
                  <div key={sezione} className="mb-4">
                    <h5 className="text-secondary">{sezione}</h5>
                    <ListGroup>
                      {ingredienti.map((ing) => (
                        <ListGroup.Item
                          key={ing.id}
                          className="d-flex justify-content-between"
                        >
                          <span className="fw-bold ingredienti-nome">
                            {ing.nome}
                          </span>
                          <span>{ing.dosaggio}</span>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                )
              )}
            <div className="d-flex justify-content-center">
              <Button
                className="shoppingBtn d-flex align-items-center"
                onClick={aggiungiAllaListaSpesa}
              >
                <FaShoppingCart className="me-1" /> Aggiungi alla lista spesa
              </Button>
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
          <h2 className="fw-bold mb-0 ms-1">Preparazione:</h2>
          <Card className="my-3">
            <Card.Text className="p-3 preparazione">
              {dettagli.procedimento}
            </Card.Text>
          </Card>
          </Col>
        </Row>
      </Container>
      </Container>
    </div>
  );
};
export default DettagliRicetta;
