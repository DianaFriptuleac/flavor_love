import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/actions/authActions";
import { Container, Row,Col, Form, Button, Alert} from "react-bootstrap";

const Login = () =>{
    const [userCredentials, setUserCredentials] = useState({email:'', password:''});
    const [message, setMessage] = useState('');
    const [variant, setVariant] = useState('success');
    const dispatch = useDispatch();

    const handleChange = (e) =>{
        const {name, value} = e.target;
        setUserCredentials({ ...userCredentials, [name]:value})
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        try{
            dispatch(loginUser(userCredentials));
            setMessage('Login effettuato con successo!');
            setVariant('success');
        } catch(er){
            setMessage('Errore durante il login! Riprova.');
            setVariant('danger');
        }
    }

    return(
        <Container>
            <Row className = "justify-content-center" >
                <Col md={6}>
                <h1>Fai il Login</h1>
                <Form onSubmit={handleSubmit} className="p-4 shadow rounded">
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
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
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={userCredentials.password}
                onChange={handleChange}
                placeholder="Inserisci la tua password"
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Accedi
            </Button>
          </Form>
          {message && <Alert variant={variant} className="mt-3">{message}</Alert>}
                </Col>

            </Row>
        </Container>
    );
}

export default Login;