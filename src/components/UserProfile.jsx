import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions/authActions";
import { Container, Card, Button, Form, Alert, Modal } from "react-bootstrap";
import { uploadAvatar, deleteMe } from "../redux/actions/profileActions";

const UserProfile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(
    user?.avatar || "/assets/avatar_fragola.jpg"
  );
  const [edit, setEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [data, setData] = useState({
    nome: user?.nome || " ",
    cognome: user?.cognome || " ",
    email: user?.email || " ",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleAvatarChange = (e) => {
    const img = e.target.img[0];
    if (img) {
      const formData = new FormData();
      formData.append("avatar", img);
      dispatch(uploadAvatar(formData));
      setAvatar(URL.createObjectURL(img));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(uploadAvatar(data));
    setEdit(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    dispatch(deleteMe());
  };

  const handleLogout = () => {
    setShowLogoutAlert(false);
    dispatch(logoutUser());
  };

  return (
    <div className="d-flex justify-content-center mt-5">
      <Container>
        <Card style={{ width: "50rem" }}>
          <Card.Body className="d-flex">
            <div style={{ flex: 1, textAlign: "center" }}>
              <img
                src={avatar}
                alt="Avatar"
                className="rounded-circle mb-3"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              {edit && (
                <Form.Group>
                  <Form.Label>Modifica Avatar</Form.Label>
                  <Form.Control type="file" onChange={handleAvatarChange} />
                </Form.Group>
              )}
            </div>
            <div style={{ flex: 2 }}>
              <h2 className="text-center mb-4">Profilo Utente</h2>
              {edit ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control
                      type="text"
                      name="nome"
                      value={data.nome}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Cognome</Form.Label>
                    <Form.Control
                      type="text"
                      name="cognome"
                      value={data.cognome}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={data.email}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Salva
                  </Button>
                  <Button
                    variant="secondary"
                    className="ms-2"
                    onClick={() => setEdit(false)}
                  >
                    Annulla
                  </Button>
                </Form>
              ) : (
                <div>
                  <p>
                    <strong>Nome:</strong> {user.nome}
                  </p>
                  <p>
                    <strong>Cognome:</strong> {user.cognome}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <Button variant="warning" onClick={() => setEdit(true)}>
                    Modifica
                  </Button>
                </div>
              )}
            </div>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-between">
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              Cancella Account
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowLogoutAlert(true)}
            >
              Logout
            </Button>
          </Card.Footer>
        </Card>

        {/* Modal di conferma cancellazione */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
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
            >
              Annulla
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Conferma
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Alert di conferma logout */}
        <Alert show={showLogoutAlert} variant="warning" className="mt-3">
          <Alert.Heading>Conferma Logout</Alert.Heading>
          <p>Sei sicuro di voler uscire?</p>
          <div className="d-flex justify-content-end">
            <Button
              onClick={() => setShowLogoutAlert(false)}
              variant="outline-secondary"
            >
              Annulla
            </Button>
            <Button onClick={handleLogout} variant="danger" className="ms-2">
              Logout
            </Button>
          </div>
        </Alert>
      </Container>
    </div>
  );
};

export default UserProfile;
