import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/actions/authActions";
import { Container, Row,Col, Form, Button, Alert} from "react-bootstrap";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";

const Login = () =>{
    const [userCredentials, setUserCredentials] = useState({email:'', password:''});
    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState('success');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    if(isAuthenticated){
      return(
        <div className="login-background">
        <Container>
           <Row className="justify-content-center">
          <Col md={6}>
            <Alert variant="info" className="mt-3 login-container border border-0">
              <h4 className="text-light mb-0 mt-2 loginTitle">Sei già autenticato!</h4>
              <p className="text-light alert-p">Hai già effettuato il login. Torna alla pagina del tuo profilo.</p>
              <div className="d-flex justify-content-end">
                <Button className="alert-auth-btn" onClick={() => navigate("/userprofile")}>
                  Vai al Profilo
                </Button>
              </div>
            </Alert>
          </Col>
        </Row>
        </Container>
        </div>
      )
    }

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setUserCredentials({ ...userCredentials, [name]:value})
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();
        try {
            await dispatch(loginUser(userCredentials));
            setMessage('Login effettuato con successo!');
            setVariant('success');
            navigate("/userprofile");
          } catch (error) {
            setMessage(error.message || 'Errore durante il login! Riprova.');
            setVariant('danger');
          }
    }

    return(
      <div className="login-background">
        <Container>
            <Row className = "justify-content-center" >
                <Col md={6}>
                <h1 className="text-light mb-0 text-center mt-2 loginTitle">
                    Fai il Login</h1>
                    <Form onSubmit={handleSubmit} className="login-container">
            <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label className="text-light">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={userCredentials.email}
                onChange={handleChange}
                placeholder="Inserisci la tua email"
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label className="text-light">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={userCredentials.password}
                onChange={handleChange}
                placeholder="Inserisci la tua password"
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button type="submit" className="w-25 mt-3 loginButton">
                Accedi
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

export default Login;