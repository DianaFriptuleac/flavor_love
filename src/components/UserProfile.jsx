import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Modal,
} from "react-bootstrap";
import {
  fetchRicette,
  fetchRicetteUtente,
} from "../redux/actions/fetchRicetteAction";
import RicetteUtente from "../components/RicetteUtente";

import {
  uploadAvatar,
  deleteMe,
  updateProfile,
  fetchUserProfile,
} from "../redux/actions/profileActions";
import "../css/UserProfile.css";
import { useNavigate } from "react-router-dom";
//import { logoutUser } from "../redux/actions/authActions";

const UserProfile = () => {
  const user = useSelector((state) => state.profile?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ricette = useSelector((state) => state.ricette?.ricette || []);
  const error = useSelector((state) => state.ricette?.error || null);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);

  // Stato locale per i dati utente
  const [data, setData] = useState({
    nome: "",
    cognome: "",
    email: "",
    avatar: "/assets/avatar_fragola.jpg", // Avatar di default
  });

  const [edit, setEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  //const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  // Sincronizzo lo stato locale con Redux
  useEffect(() => {
    if (user) {
      setData({
        nome: user.nome || "",
        cognome: user.cognome || "",
        email: user.email || "",
        avatar: user.avatar || "/assets/avatar_fragola.jpg", // Avatar di default se non presente
      });
    } else {
      dispatch(fetchUserProfile()); // Recupero i dati se non disponibili
    }
    // Fetch delle ricette
    dispatch(fetchRicette());
  }, [user, dispatch]);

  //Fetch delle ricette per account utente
  useEffect(() => {
    dispatch(fetchRicetteUtente());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const img = e.target.files[0];
    if (img) {
      const formData = new FormData();
      formData.append("avatar", img);

      setIsLoadingAvatar(true);
      dispatch(uploadAvatar(formData))
        .then(() => {
          dispatch(fetchUserProfile()); // Aggiorno i dati utente
        })
        .finally(() => {
          setIsLoadingAvatar(false);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      nome: data.nome,
      cognome: data.cognome,
      email: data.email,
    };

    dispatch(updateProfile(updatedData)).then(() => {
      dispatch(fetchUserProfile()); // Aggiorno i dati utente
      setEdit(false); // Chiudo il form
    });
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    dispatch(deleteMe()).then(() => {
      navigate("/"); //dopo la cancellazione mi riporta alla Home
    });
  };

  return (
    <div className="userProfile_background">
      <Container className="userContainer">
      <Container fluid className="d-flex justify-content-center mt-4">
        <Card style={{ width: "50rem" }} className="userProfile_container">
          <Card.Body className="d-flex responsive-layout">
            <div style={{ flex: 1 }} className="me-3">
              <img src={data.avatar} alt="Avatar" className="mb-3 avatar-img" />
              {edit && (
                <Form.Group>
                  <Form.Label className="fw-bold mb-0">
                    Modifica Avatar
                  </Form.Label>
                  {isLoadingAvatar ? (
                    <div className="d-flex justify-content-center align-items-center mt-2">
                      <div
                        className="spinner-border text-danger"
                        role="status"
                      >
                        <span className="visually-hidden">Caricamento...</span>
                      </div>
                    </div>
                  ) : (
                    <Form.Control type="file" onChange={handleAvatarChange} />
                  )}
                </Form.Group>
              )}
            </div>
            <div style={{ flex: 2 }}>
              <h2 className="text-end mb-4 me-3 profileTitle">Account</h2>
              {edit ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold mb-0">Nome</Form.Label>
                    <Form.Control
                      type="text"
                      name="nome"
                      value={data.nome}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold mb-0">Cognome</Form.Label>
                    <Form.Control
                      type="text"
                      name="cognome"
                      value={data.cognome}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold mb-0">Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={data.email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <div>
                    <Button type="submit" className="save_annulla_button">
                      Salva
                    </Button>
                    <Button
                      className="ms-2 save_annulla_button"
                      onClick={() => setEdit(false)}
                    >
                      Annulla
                    </Button>
                  </div>
                </Form>
              ) : (
                <div>
                  <p>
                    <strong>Nome:</strong> {data.nome}
                  </p>
                  <p>
                    <strong>Cognome:</strong> {data.cognome}
                  </p>
                  <p>
                    <strong>Email:</strong> {data.email}
                  </p>
                  <Button
                    className="modifica-button"
                    onClick={() => setEdit(true)}
                  >
                    Modifica
                  </Button>
                </div>
              )}
            </div>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-end profile_card_footer">
            <Button
              variant="danger"
              className="delete-button"
              onClick={() => setShowDeleteModal(true)}
            >
              Cancella Account
            </Button>
          </Card.Footer>
        </Card>

        {/* Modal -> conferma delete */}
        <Modal
          className="mt-3"
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
        >
          <div className="delete-modal">
            <Modal.Header closeButton>
              <Modal.Title>Conferma Cancellazione</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Sei sicuro di voler cancellare il tuo account?
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
                className="annulla-cancella-button"
              >
                Annulla
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                className="conferma-cancella-button"
              >
                Conferma
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
      </Container>
      <Container>
        {error && <Alert variant="danger">Errore: {error}</Alert>}
        <RicetteUtente ricette={ricette} />
      </Container>
      <Container>
        <Row className="ricettario_row d-flex justify-content-center mt-4">
          <Col md={3}>
            <div className="ricettario-container">
              <h3 className="ricettario-title">I tuoi Ricettari</h3>

              <img
                onClick={() => navigate("/ricettario")}
                className="ricettario_img"
                src="/assets/ricettario.jpg"
                alt="Vai ai Ricettari"
              />
            </div>
          </Col>
          <Col md={3}>
            <div className="liked-container mb-2">
              <h3 className="liked-title">I tuoi preferiti</h3>

              <img
                onClick={() => navigate("/ricette/liked")}
                className="heart_img"
                src="/assets/heart.jpg"
                alt="Vai ai liked"
              />
            </div>
          </Col>
          <Col md={3}>
            <div className="lista-container">
              <h3 className="lista-title">Lista spesa</h3>

              <img
                onClick={() => navigate("/listaSpesa")}
                className="listaSpesa_img"
                src="/assets/listaSpesa.jpg"
                alt="Vai alla lista spesa"
              />
            </div>
          </Col>
        </Row>
      </Container>
      </Container>
    </div>
  );
};

export default UserProfile;
