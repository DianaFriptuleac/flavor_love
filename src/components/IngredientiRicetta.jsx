import React, { useState } from "react";
import { Form, Button, ListGroup } from "react-bootstrap";
const IngredientiRicetta = ({ ingrediente = [], addIngrediente, removeIngrediente }) => {
    const [currentSezione, setCurrentSezione] = useState("");
    const [ingredientData, setIngredientData] = useState({
        nome: "",
        dosaggio: "",
        sezione: "",
      });

      const handleInputChangeIngredient = (e) =>{
        const {name, value} = e.target;
        setIngredientData({...ingredientData, [name]:value});
      };

      const handleAddIngredient=()=>{
        addIngrediente({...ingredientData, sezione:currentSezione});
        setIngredientData({nome:"", dosaggio:"", sezione:""});
      };
      return(
        <div>
            <h4>Ingredienti:</h4>
            <Form.Group className="mb-3">
        <Form.Label>Sezione</Form.Label>
        <Form.Control
          type="text"
          value={currentSezione}
          onChange={(e) => setCurrentSezione(e.target.value)}
        />
        <Button variant="info" className="mt-2" onClick={() => setCurrentSezione(currentSezione)}>
          Cambia Sezione
        </Button>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Nome</Form.Label>
        <Form.Control
          type="text"
          name="nome"
          value={ingredientData.nome}
          onChange={handleInputChangeIngredient}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Dosaggio</Form.Label>
        <Form.Control
          type="text"
          name="dosaggio"
          value={ingredientData.dosaggio}
          onChange={handleInputChangeIngredient}
        />
      </Form.Group>
      <Button variant="secondary" onClick={handleAddIngredient}>
        Aggiungi Ingrediente
      </Button>
      <ListGroup className="mt-3">
        {ingrediente.map((ingrediente, index) => (
          <ListGroup.Item key={index} className="d-flex justify-content-between">
            {`${ingrediente.nome} - ${ingrediente.dosaggio} (${ingrediente.sezione})`}
            <Button variant="danger" size="sm" onClick={() => removeIngrediente(index)}>
              Rimuovi
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default IngredientiRicetta;