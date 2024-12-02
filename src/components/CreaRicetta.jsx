import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addIngrediente,
  creaRicetta,
  addImage,
  removeIngrediente,
  removeImage,
} from "../redux/actions/creaRicetta";
import { Container, Form, Button, Alert } from "react-bootstrap";
import IngredientiRicetta from "./IngredientiRicetta";
import ImgRicetta from "./ImgRicetta";
import "../css/CreaRicetta.css";


const CreaRicetta = () => {
  const dispatch = useDispatch();
  const ricettaState = useSelector((state) => state.ricetta);
  const token = useSelector((state) => state.auth.token);

  const [ricettaData, setRicettaData] = useState({
    titolo: "",
    procedimento: "",
    difficoltaRicetta: "FACILE",
    tempoPreparazioneMinuti: 1,
    tempoCotturaMinuti: 0,
    costoRicetta: "BASSO",
    nomeCategorieRicette: [],
  });

  const [categorie, setCategorie] = useState([]);
  const [alert, setAlert] = useState({ message: "", variant: "" });

  // Fetch categorie
  const fetchCategorie = async () => {
    try {
      if (!token) throw new Error("Token mancante!");

      const response = await fetch("http://localhost:3001/api/categorie", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategorie(data.content);
      } else {
        throw new Error("Errore nel fetch delle categorie");
      }
    } catch (error) {
      setAlert({ message: error.message, variant: "danger" });
    }
  };
  useEffect(() => {
    fetchCategorie(); 
  }, [token]);
  

  const handleRicettaChange = (e) => {
    const { name, value } = e.target;
    setRicettaData({ ...ricettaData, [name]: value });
  };

  const handleCategoryChange = (e) => {
    setRicettaData({
      ...ricettaData,
      nomeCategorieRicette: [e.target.value],
    });
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
    <div className="creaRicetta_background">
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

        {/*categorie */}
        <Form.Group className="mb-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Select
            value={ricettaData.nomeCategorieRicette[0] || ""}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Seleziona una categoria</option>
            {categorie.map((categoria) => (
              <option key={categoria.nome} value={categoria.nome}>
                {categoria.nome}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        {/*ingredienti */}

        <IngredientiRicetta
          ingrediente={ricettaState.ingredienti} // Corretto
          addIngrediente={(ingrediente) =>
            dispatch(addIngrediente(ingrediente))
          }
          removeIngrediente={(index) => dispatch(removeIngrediente(index))}
        />

        {/* immagini */}
        <ImgRicetta
          images={ricettaState.image} // Corretto
          addImage={(file) =>
            dispatch(addImage(ricettaState.ricetta?.id, file))
          }
          removeImage={(index) => dispatch(removeImage(index))}
        />
        <div className="mt-4">
          <Button type="submit" variant="primary">
            Crea Ricetta
          </Button>
        </div>
      </Form>
    </Container>
    </div>
  );
};

export default CreaRicetta;
