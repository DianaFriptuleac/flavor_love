import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  FormGroup,
  Alert,
} from "react-bootstrap";
import "../css/Register.css";

function Register() {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");

  //Cambiamenti campi modulo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Invio modulo
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(
          `Registrazione completata! Ti diamo il benvenuto, ${data.nome}`
        );
      } else {
        const errorData = await response.json();
        setMessage(`Errore nella registrazione: ${errorData.message}`);
        setVariant("danger");
      }
    } catch (error) {
      setMessage("Errore di connessione al server.");
      setVariant("danger");
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="text-light mb-0 text-center mt-2 registerTitle">
            Registrati
          </h1>
          <Form onSubmit={handleSubmit} className="register-container">
            <FormGroup>
              <Form.Label className="text-light">Nome</Form.Label>
              <Form.Control
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Inserisci il tuo nome"
                required
              />
            </FormGroup>

            <FormGroup className="mt-2">
              <Form.Label className="text-light">Cognome</Form.Label>
              <Form.Control
                type="text"
                name="cognome"
                value={formData.cognome}
                onChange={handleChange}
                placeholder="Inserisci il tuo cognome"
                required
              />
            </FormGroup>

            <FormGroup className="mt-2">
              <Form.Label className="text-light">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Inserisci la tua email"
                required
              />
            </FormGroup>

            <FormGroup className="mt-2">
              <Form.Label className="text-light">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Inserisci una password"
                required
              />
            </FormGroup>

            <div className="d-flex justify-content-end">
              <Button type="submit" className="w-25 mt-3 registerButton">
                Registrati
              </Button>
            </div>
          </Form>
          {message && (
            <Alert
              className={`mt-3 ${
                variant === "success" ? "alert-success" : "alert-danger"
              }`}
            >
              {message}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
