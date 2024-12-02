import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addIngrediente, creaRicetta, addImage, removeIngrediente } from "../redux/actions/creaRicetta";
import { Container, Form, Button, Alert, ListGroup } from "react-bootstrap";

const CreaRicetta = () => {
  const dispatch = useDispatch();
  const ricettaState = useSelector((state) => state.ricetta);

  const [ricettaData, setRicettaData] = useState({
    titolo: "",
    procedimento: "",
    difficoltaRicetta: "FACILE",
    tempoPreparazioneMinuti: 1, // Valore minimo valido
    tempoCotturaMinuti: 0,
    costoRicetta: "BASSO",
    nomeCategorieRicette: ["PRIMI"], // Categoria predefinita
  });

  const [ingredientiData, setIngredientiData] = useState({
    nome: "",
    dosaggio: "",
    sezione: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [alert, setAlert] = useState({ message: "", variant: "" });

  const handleRicettaChange = (e) => {
    const { name, value } = e.target;
    setRicettaData({ ...ricettaData, [name]: value });
  };

  const handleIngredientiChange = (e) => {
    const { name, value } = e.target;
    setIngredientiData({ ...ingredientiData, [name]: value });
  };

  const handleAddIngrediente = () => {
    dispatch(addIngrediente(ingredientiData));
    setIngredientiData({ nome: "", dosaggio: "", sezione: "" });
  };

  const handleRemoveIngrediente = (index) => {
    dispatch(removeIngrediente(index));
  };
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleAddImage = async () => {
    if (!ricettaState.ricetta) {
      setAlert({ message: "Crea prima la ricetta per aggiungere un'immagine!", variant: "warning" });
      return;
    }

    try {
      await dispatch(addImage(ricettaState.ricetta.id, imageFile));
      setAlert({ message: "Immagine caricata con successo!", variant: "success" });
    } catch (error) {
      setAlert({ message: "Errore durante il caricamento dell'immagine.", variant: "danger" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(creaRicetta({ ...ricettaData, ingredienti: ricettaState.ingredienti }));
      setAlert({ message: "Ricetta creata con successo!", variant: "success" });
    } catch (error) {
      setAlert({ message: "Errore durante la creazione della ricetta.", variant: "danger" });
    }
  };

  return (
    <Container>
      <h2 className="text-center my-4">Crea una nuova ricetta</h2>
      {alert.message && <Alert variant={alert.variant}>{alert.message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            type="text"
            name="titolo"
            value={ricettaData.titolo}
            onChange={handleRicettaChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Procedimento</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            name="procedimento"
            value={ricettaData.procedimento}
            onChange={handleRicettaChange}
            required
          />
        </Form.Group>
        {/* Gestione ingredienti */}
        <h4>Ingredienti</h4>
        <Form.Group className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            name="nome"
            value={ingredientiData.nome}
            onChange={handleIngredientiChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Dosaggio</Form.Label>
          <Form.Control
            type="text"
            name="dosaggio"
            value={ingredientiData.dosaggio}
            onChange={handleIngredientiChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Sezione</Form.Label>
          <Form.Control
            type="text"
            name="sezione"
            value={ingredientiData.sezione}
            onChange={handleIngredientiChange}
          />
        </Form.Group>
        <Button variant="secondary" onClick={handleAddIngrediente}>
          Aggiungi Ingrediente
        </Button>
        <ListGroup className="mt-3">
          {ricettaState.ingredienti.map((ingrediente, index) => (
            <ListGroup.Item key={index}>
              {ingrediente.nome} - {ingrediente.dosaggio} ({ingrediente.sezione})
              <Button
                variant="danger"
                size="sm"
                className="ms-2"
                onClick={() => handleRemoveIngrediente(index)}
              >
                Rimuovi
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
        {/* Gestione immagini */}
        <h4 className="mt-4">Immagini</h4>
        <Form.Group className="mb-3">
          <Form.Label>Carica Immagine</Form.Label>
          <Form.Control type="file" onChange={handleImageChange} />
        </Form.Group>
        <Button variant="secondary" onClick={handleAddImage}>
          Aggiungi Immagine
        </Button>
        <div className="mt-4">
          <Button type="submit" variant="primary">
            Crea Ricetta
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CreaRicetta;
