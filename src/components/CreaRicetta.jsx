import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addIngrediente,
  creaRicetta,
  addImage,
  removeIngrediente,
} from "../redux/actions/creaRicetta";
import { Container, Form, Button, Alert, ListGroup } from "react-bootstrap";
import IngredientiRicetta from "./IngredientiRicetta";
import ImgRicetta from "./ImgRicetta";

const CreaRicetta = () => {
  const dispatch = useDispatch();
  const ricettaState = useSelector((state) => state.ricetta);

  const [ricettaData, setRicettaData] = useState({
    titolo: "",
    procedimento: "",
    difficoltaRicetta: "FACILE",
    tempoPreparazioneMinuti: 1,
    tempoCotturaMinuti: 0,
    costoRicetta: "BASSO",
    nomeCategorieRicette: ["PRIMI"],
  });

  const [alert, setAlert] = useState({ message: "", variant: "" });

  const handleRicettaChange = (e) => {
    const { name, value } = e.target;
    setRicettaData({ ...ricettaData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        creaRicetta({ ...ricettaData, ingredienti: ricettaState.ingredienti })
      );
      setAlert({ message: "Ricetta creata con successo!", variant: "success" });
    } catch (error) {
      setAlert({
        message: "Errore durante la creazione della ricetta.",
        variant: "danger",
      });
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
            rows={6}
            name="procedimento"
            value={ricettaData.procedimento}
            onChange={handleRicettaChange}
            required
          />
        </Form.Group>
        {/*ingredienti */}

        <IngredientiRicetta
          ingrediente={ricettaState.ingrediente}
          addIngrediente={(ingrediente) =>
            dispatch(addIngrediente(ingrediente))
          }
          removeIngrediente={(index) => dispatch(removeIngrediente(index))}
        />

        {/* immagini */}
        <ImgRicetta
          images={ricettaState.images}
          addImage={(file) =>
            dispatch(addImage(ricettaState.ricetta?.iid, file))
          }
          removeImage={(index) =>
            dispatch({ type: "REMOVE_IMAGE", payload: index })
          }
        />
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
