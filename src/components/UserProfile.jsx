import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container,Row, Col, Card, Button, Form, Alert, Modal } from "react-bootstrap";
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
import { logoutUser } from "../redux/actions/authActions";
import Ricettario from "./Ricettario";

const UserProfile = () => {
  const user = useSelector((state) => state.profile?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ricette = useSelector((state) => state.ricette?.ricette || []);
  const error = useSelector((state) => state.ricette?.error || null);

  // Stato locale per i dati utente
  const [data, setData] = useState({
    nome: "",
    cognome: "",
    email: "",
    avatar: "/assets/avatar_fragola.jpg", // Avatar di default
  });

  const [edit, setEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

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

      dispatch(uploadAvatar(formData)).then(() => {
        dispatch(fetchUserProfile()); // Aggiorno i dati utente
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

  const handleLogout = () => {
    //resetto lo stato di Redux
    dispatch(logoutUser());
    //chiudo l'alert
    setShowLogoutAlert(false);
    //reindirizzo alla Home
    navigate("/login");
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    dispatch(deleteMe()).then(() => {
      navigate("/"); //dopo la cancellazione mi riporta alla Home
    });
  };

  return (
    <div className="userProfile_background">
      <Container className="d-flex justify-content-center">
        <Card style={{ width: "50rem" }} className="userProfile_container">
          <Card.Body className="d-flex responsive-layout">
            <div style={{ flex: 1 }} className="me-3">
              <img src={data.avatar} alt="Avatar" className="mb-3 avatar-img" />
              {edit && (
                <Form.Group>
                  <Form.Label className="fw-bold mb-0">
                    Modifica Avatar
                  </Form.Label>
                  <Form.Control type="file" onChange={handleAvatarChange} />
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
          <Card.Footer className="d-flex justify-content-between profile_card_footer">
            <Button
              variant="danger"
              className="delete-button"
              onClick={() => setShowDeleteModal(true)}
            >
              Cancella Account
            </Button>

            <Button
              variant="secondary"
              onClick={() => setShowLogoutAlert(true)}
              className="logout-button"
            >
              Logout
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

        {/* Alert-> conferma logout (con sfondo semitrasparente)*/}
        {showLogoutAlert && <div className="alert-overlay"></div>}
        <Alert show={showLogoutAlert} className="mt-3 logout-alert">
          <Alert.Heading>Conferma Logout</Alert.Heading>
          <p>Sei sicuro di voler uscire?</p>
          <div className="d-flex justify-content-between">
            <Button
              onClick={() => setShowLogoutAlert(false)}
              variant="outline-secondary"
              className="annulla-logout-button"
            >
              Annulla
            </Button>
            <Button
              variant="danger"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Alert>
      </Container>
      <Container>
        {error && <Alert variant="danger">Errore: {error}</Alert>}
        <RicetteUtente ricette={ricette} />
      </Container>
      <Container>
  <Row className="d-flex align-items-center justify-content-center">
    <Col md={4}>
      <Ricettario />
    </Col>
  </Row>
</Container>

    </div>
  );
};

export default UserProfile;
