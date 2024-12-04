import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchIngredienti,
  removeIngrediente,
  addIngredienti,
} from "../redux/actions/creaRicetta";
import { Form, Button, ListGroup } from "react-bootstrap";

const IngredientiRicetta = ({ ricettaId }) => {
  const dispatch = useDispatch();
  const ingredienti = useSelector((state) => state.ricetta.ingredienti);
  const [currentSezione, setCurrentSezione] = useState("");
  const [ingredientData, setIngredientData] = useState({
    nome: "",
    dosaggio: "",
    sezione: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (ricettaId) {
      dispatch(fetchIngredienti(ricettaId));
    }
  }, [ricettaId, dispatch]);

  useEffect(() => {
    console.log("Ingredienti caricati:", ingredienti); // Debug degli ingredienti caricati
  }, [ingredienti]);

  const handleInputChangeIngredient = (e) => {
    const { name, value } = e.target;
    setIngredientData({ ...ingredientData, [name]: value });
  };

  const handleAddIngredient = () => {
    if (!currentSezione.trim()) {
      setMessage("Inserisci una sezione prima di aggiungere l'ingrediente.");
      return;
    }
    if (!ingredientData.nome.trim() || !ingredientData.dosaggio.trim()) {
      setMessage("Completa tutti i campi per aggiungere un ingrediente.");
      return;
    }

    const nuovoIngrediente = {
      ...ingredientData,
      sezione: currentSezione,
    };

    dispatch(
      addIngredienti(ricettaId, [
        { ...ingredientData, sezione: currentSezione },
      ])
    );

    setIngredientData({ nome: "", dosaggio: "", sezione: "" });
    setMessage("Ingrediente aggiunto con successo!");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleDeleteIngrediente = (ingredienteId) => {
    dispatch(removeIngrediente(ingredienteId));
  };
  

  const groupedIngredients = Array.isArray(ingredienti)
  ? ingredienti.reduce((acc, curr) => {
      if (!acc[curr.sezione]) {
        acc[curr.sezione] = [];
      }
      acc[curr.sezione].push(curr);
      return acc;
    }, {})
  : {};



  return (
    <div>
      <h4>Ingredienti:</h4>
      {message && <div className="alert alert-info mt-2">{message}</div>}
      <Form.Group className="mb-3">
        <Form.Label>Sezione</Form.Label>
        <Form.Control
          type="text"
          value={currentSezione}
          placeholder="Inserisci la sezione"
          onChange={(e) => setCurrentSezione(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Nome</Form.Label>
        <Form.Control
          type="text"
          name="nome"
          value={ingredientData.nome}
          placeholder="Es. Farina"
          onChange={handleInputChangeIngredient}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Dosaggio</Form.Label>
        <Form.Control
          type="text"
          name="dosaggio"
          value={ingredientData.dosaggio}
          placeholder="Es. 500g"
          onChange={handleInputChangeIngredient}
        />
      </Form.Group>
      <Button variant="secondary" onClick={handleAddIngredient}>
        Aggiungi Ingrediente
      </Button>
      
      {Object.entries(groupedIngredients).map(([sezione, ingredients]) => (
  <div key={sezione} className="mt-3">
    <h5>{sezione}</h5>
    <ListGroup>
      {ingredients.map((ingredienti, index) => (
     <ListGroup.Item
     key={ingredienti.id}
     className="d-flex justify-content-between"
   >
     {`${ingredienti.nome || "Nome non disponibile"} - ${
       ingredienti.dosaggio || "Dosaggio non disponibile"
     }`}
     <Button
       variant="danger"
       size="sm"
       onClick={() => handleDeleteIngrediente(ingredienti.id)}
     >
            Rimuovi
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  </div>
))}

    </div>
  );
};

export default IngredientiRicetta;
