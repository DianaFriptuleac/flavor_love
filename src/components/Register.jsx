import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, FormGroup } from 'react-bootstrap';

function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');


  //Cambiamenti campi modulo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Invio modulo
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Registrazione completata! Ti diamo il benvenuto, ${data.nome}`);
      } else {
        const errorData = await response.json();
        setMessage(`Errore nella registrazione: ${errorData.message}`);
        setVariant('danger');
      }
    } catch (error) {
      setMessage('Errore di connessione al server.');
      setVariant('danger');
    }
  };

  return (
    <Container>
      <Row className='justify-content-center'>
        <Col md={8}>

        <h1>Registrati</h1>
        <Form onSubmit={handleSubmit} className="p-4 shadow rounded">
          <FormGroup>
            <Form.Label>
              Nome
            </Form.Label>
            <Form.Control
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Inserisci il tuo nome"
                required
              />
          </FormGroup>


          <FormGroup>
            <Form.Label>
              Cognome
            </Form.Label>
            <Form.Control
                type="text"
                name="cognome"
                value={formData.cognome}
                onChange={handleChange}
                placeholder="Inserisci il tuo cognome"
                required
              />
          </FormGroup>

              <FormGroup>
            <Form.Label>
              Email
            </Form.Label>
            <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Inserisci la tua email"
                required
              />
          </FormGroup>   

              <FormGroup>
            <Form.Label>
              Password
            </Form.Label>
            <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Inserisci una password"
                required
              />
          </FormGroup>  

           <Button variant="primary" type="submit" className="w-100">
              Registrati
            </Button>
             </Form>
          {message && <Alert variant={variant} className="mt-3">{message}</Alert>}
        </Col>
      </Row>
    </Container>
  )
}

export default Register;
