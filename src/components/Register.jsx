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
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions/authActions";

function Register() {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  if(isAuthenticated){
    return(
      <div className="register-background">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
          <Alert className="register-container mt-3 border border-0">
            <h4 className="registerTitle text-light">
              Logout necessario!
            </h4>
            <p className="alert-p text-light">
            È necessario effettuare il logout per registrare un altro utente.
            </p>
            <div className="d-flex justify-content-end">
              <Button
                className="alert-auth-btn"
                onClick={()=>{
                  dispatch(logoutUser());
                  navigate("/register")
                }}>
                  Effettua logout
              </Button>
              </div>

          </Alert>
          </Col>
        </Row>
      </Container>
      </div>
    )
  }

  //Cambiamenti campi modulo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Invio modulo
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
        setVariant("success");
        setLoading(false);
        //reindirizzo al Login
        navigate("/login");
        
      } else {
        const errorData = await response.json();
        setMessage(`Errore nella registrazione: ${errorData.message}`);
        setLoading(false);
        setVariant("danger");
      }
    } catch (error) {
      setMessage("Errore di connessione al server.");
      setLoading(false);
      setVariant("danger");
    }
  };

  return (
    <div className="register-background">
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
    </div>
  );
}

export default Register;
