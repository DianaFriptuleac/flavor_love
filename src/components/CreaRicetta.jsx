import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addIngredienti,
  addImage,
  removeIngrediente,
  removeImage,
  creaRicetta,
} from "../redux/actions/creaRicetta";
import { Container, Form, Button, Alert } from "react-bootstrap";
import IngredientiRicetta from "./IngredientiRicetta";
import ImgRicetta from "./ImgRicetta";
import { useNavigate } from "react-router-dom";
import "../css/CreaRicetta.css";

const CreaRicetta = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ricettaState = useSelector((state) => state.ricetta); //accedo allo stato ricetta
  const token = useSelector((state) => state.auth.token); //accedo al token

  //stato locale per la ricetta, categorie, alert e ricettta creata
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
  const [createdRicetta, setCreatedRicetta] = useState(null);

  //  Fetch categorie
  const fetchCategorie = async () => {
    try {
      if (!token) throw new Error("Token mancante!");

      const response = await fetch("http://localhost:3001/api/categorie", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // aggiorno la ricetta in base agli input
  const handleRicettaChange = (e) => {
    const { name, value } = e.target;
    setRicettaData((prevData) => ({
      ...prevData,
      [name]:
        name === "tempoPreparazioneMinuti" || name === "tempoCotturaMinuti"
          ? parseInt(value || "0", 10) // Converto a 0 se e vuoto
          : value,
    }));
  };

  // Aggiungo una categoria selezionata
  const handleCategoryChange = (e) => {
    const selCategory = e.target.value;
    setRicettaData((prevData) => ({
      ...prevData,
      nomeCategorieRicette: [...prevData.nomeCategorieRicette, selCategory],
    }));
  };

  // Gestisco la creazione della ricetta - invio dati all'API e salvo la ricetta creata
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Creazione della ricetta
      const response = await dispatch(creaRicetta(ricettaData));
      if (!response.payload?.id) {
        throw new Error("Errore durante la creazione della ricetta.");
      }

      // Salvo la ricetta creata
      setCreatedRicetta(response.payload);

      // Resetto i campi locali
      setRicettaData({
        titolo: "",
        procedimento: "",
        difficoltaRicetta: "FACILE",
        tempoPreparazioneMinuti: 1,
        tempoCotturaMinuti: 0,
        costoRicetta: "BASSO",
        nomeCategorieRicette: [],
      });

      setAlert({
        message: "Ricetta creata con successo! Ora puoi caricare un'immagine.",
        variant: "success",
      });
    } catch (error) {
      setAlert({ message: error.message, variant: "danger" });
    }
  };

  //salvaro e navigo
  const handleSaveAndNavigate = async () => {
    try {
      if (createdRicetta?.id && ricettaState.ingredienti.length > 0) {
        // Invio un array di ingredienti
        const ingredientiPayload = ricettaState.ingredienti.map(
          (ingrediente) => ({
            nome: ingrediente.nome,
            dosaggio: ingrediente.dosaggio,
            sezione: ingrediente.sezione,
          })
        );

        await dispatch(addIngredienti(createdRicetta.id, ingredientiPayload));
      }
      navigate("/userprofile");
    } catch (error) {
      setAlert({ message: error.message, variant: "danger" });
    }
  };

  // Gestisco il caricamento dell'immagine della ricetta (vari controlli)
  const handleImageUpload = async (file) => {
    try {
      if (!file) {
        throw new Error("File immagine mancante!");
      }

      if (!createdRicetta?.id) {
        throw new Error("ID ricetta mancante!");
      }

      console.log("Caricamento immagine per ricetta ID:", createdRicetta.id);
      console.log("File selezionato:", file);

      // Invio il file tramite addImage
      await dispatch(addImage(createdRicetta.id, file));
      setAlert({
        message: "Immagine caricata con successo!",
        variant: "success",
      });
    } catch (error) {
      console.error("Errore caricamento immagine:", error.message);
      setAlert({ message: error.message, variant: "danger" });
    }
  };

  return (
    <div className="creaRicetta_background">
      <Container>
        <h2 className="text-center my-4">Crea una nuova ricetta</h2>
        {alert.message && (
          <Alert variant={alert.variant}>{alert.message}</Alert>
        )}
        {/*titolo ricetta */}
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

            {/*tempo di preparazione */}
            <Form.Group className="mb-3">
              <Form.Label>Tempo di preparazione (minuti)</Form.Label>
              <Form.Control
                type="number"
                name="tempoPreparazioneMinuti"
                value={ricettaData.tempoPreparazioneMinuti}
                onChange={handleRicettaChange}
                min="1"
                required
              />
            </Form.Group>
            {/*tempo di cottura*/}
            <Form.Group className="mb-3">
              <Form.Label>Tempo di cottura (minuti)</Form.Label>
              <Form.Control
                type="number"
                name="tempoCotturaMinuti"
                value={ricettaData.tempoCotturaMinuti}
                onChange={handleRicettaChange}
                min="0"
              />
            </Form.Group>
            {/*categorie */}
            <Form.Group className="mb-3">
              <Form.Label>Categoria</Form.Label>
              <Form.Select onChange={handleCategoryChange} value="">
                <option value="">Seleziona una categoria</option>
                {categorie.map((categoria) => (
                  <option key={categoria.nome} value={categoria.nome}>
                    {categoria.nome}
                  </option>
                ))}
              </Form.Select>
              <div>
                {ricettaData.nomeCategorieRicette.map((categoria, index) => (
                  <span key={index} className="badge bg-secondary me-2">
                    {categoria}
                  </span>
                ))}
              </div>
            </Form.Group>
            {/*dificolta */}
            <Form.Group className="mb-3">
              <Form.Label>Difficoltà</Form.Label>
              <Form.Select
                name="difficoltaRicetta"
                value={ricettaData.difficoltaRicetta}
                onChange={handleRicettaChange}
                required
              >
                <option value="FACILE">Facile</option>
                <option value="MEDIA">Media</option>
                <option value="DIFFICILE">Difficile</option>
              </Form.Select>
            </Form.Group>
            {/*costo */}
            <Form.Group className="mb-3">
              <Form.Label>Costo</Form.Label>
              <Form.Select
                name="costoRicetta"
                value={ricettaData.costoRicetta}
                onChange={handleRicettaChange}
                required
              >
                <option value="BASSO">Basso</option>
                <option value="MEDIO">Medio</option>
                <option value="ALTO">Alto</option>
              </Form.Select>
            </Form.Group>

            {/*procedimento */}
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

          {/* Invio del form */}
          <div className="mt-4">
            <Button type="submit" variant="primary">
              Crea Ricetta
            </Button>
          </div>
        </Form>

        {/*ingredienti */}

        {createdRicetta && (
          <IngredientiRicetta
          ricettaId={createdRicetta.id}
            ingrediente={ricettaState.ingredienti}
            addIngrediente={(ingrediente) =>
              dispatch(addIngredienti(createdRicetta.id, [ingrediente]))
            }
            removeIngrediente={(index) => dispatch(removeIngrediente(index))}
          />
        )}

        {/* carico l'immagine solo se la ricetta e stata creata */}
        {createdRicetta && (
          <ImgRicetta
            images={ricettaState.image}
            addImage={(file) => handleImageUpload(file)} // Passo  l'upload
            removeImage={(index) => dispatch(removeImage(index))}
          />
        )}
        {/* salvo ancle l'img. e torno al profilo */}
        <Button
          variant="success"
          className="mt-3"
          onClick={handleSaveAndNavigate}
        >
          Salva e torna al Profilo
        </Button>
      </Container>
    </div>
  );
};

export default CreaRicetta;
