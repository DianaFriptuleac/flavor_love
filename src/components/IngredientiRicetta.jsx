import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  removeIngrediente,
  addIngredienti,
} from "../redux/actions/creaRicetta";
import { Form, Button, ListGroup } from "react-bootstrap";
import { IoTrash } from "react-icons/io5";
import "../css/CreaRicetta.css";
const IngredientiRicetta = ({ ricettaId,ingredienti}) => {
  const dispatch = useDispatch();
  //const ingredienti = useSelector((state) => state.ricetta.ingredienti);
  const [currentSezione, setCurrentSezione] = useState("");
  const [ingredientData, setIngredientData] = useState({
    nome: "",
    dosaggio: "",
    sezione: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("Ingredienti caricati:", ingredienti);
  }, [ingredienti]);

  const handleAddIngredient = () => {
    if (
      !currentSezione.trim() ||
      !ingredientData.nome.trim() ||
      !ingredientData.dosaggio.trim()
    ) {
      setMessage("Completa tutti i campi.");
      return;
    }

    dispatch(
      addIngredienti(ricettaId, [
        { ...ingredientData, sezione: currentSezione },
      ])
    );

    setIngredientData({ nome: "", dosaggio: "", sezione: "" });
    setMessage("Ingrediente aggiunto!");
  };

  const handleDeleteIngrediente = (ingredienteId) => {
    dispatch(removeIngrediente(ricettaId, ingredienteId));
  };

  const groupedIngredients = ingredienti.reduce((acc, curr) => {
    if (!acc[curr.sezione]) {
      acc[curr.sezione] = [];
    }
    acc[curr.sezione].push(curr);
    return acc;
  }, {});

  return (
    <div>
      <h4 className="titolo mt-2">Ingredienti:</h4>
      {message && (
        <div className="alert creaRicetta-alert-success mt-2">{message}</div>
      )}
      <Form.Group className="mb-3">
        <Form.Label className="creaRicetta-label">Sezione</Form.Label>
        <Form.Control
          type="text"
          className="creaRicetta-input"
          value={currentSezione}
          placeholder="Inserisci la sezione"
          onChange={(e) => setCurrentSezione(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className="creaRicetta-label">Nome</Form.Label>
        <Form.Control
          type="text"
          className="creaRicetta-input"
          name="nome"
          value={ingredientData.nome}
          placeholder="Es. Farina"
          onChange={(e) =>
            setIngredientData((prev) => ({ ...prev, nome: e.target.value }))
          }
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className="creaRicetta-label">Dosaggio</Form.Label>
        <Form.Control
          type="text"
          className="creaRicetta-input"
          name="dosaggio"
          value={ingredientData.dosaggio}
          placeholder="Es. 500g"
          onChange={(e) =>
            setIngredientData((prev) => ({ ...prev, dosaggio: e.target.value }))
          }
        />
      </Form.Group>
      <Button
        variant="secondary"
        className="creaRicetta-btn"
        onClick={handleAddIngredient}
      >
        Aggiungi Ingrediente
      </Button>

      {Object.entries(groupedIngredients).map(([sezione, ingredients]) => (
        <div key={sezione} className="mt-3">
          <h5>{sezione}</h5>
          <ListGroup>
            {ingredients.map((ingredienti, i) => (
              <ListGroup.Item
                key={`${ingredienti.id}-${i}`}
                className="d-flex justify-content-between creaRicetta-input my-1"
              >
                {`${ingredienti.nome || "Nome non disponibile"} - ${
                  ingredienti.dosaggio || "Dosaggio non disponibile"
                }`}
                <Button
                  variant="outline-danger"
                  className="f-flex align-items-center"
                  size="sm"
                  onClick={() => handleDeleteIngrediente(ingredienti.id)}
                >
                  <IoTrash />
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
