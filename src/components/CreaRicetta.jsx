import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addIngredienti,
  addImage,
  removeIngrediente,
  removeImage,
  creaRicetta,
  resetRicetta,
} from "../redux/actions/creaRicetta";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import IngredientiRicetta from "./IngredientiRicetta";
import ImgRicetta from "./ImgRicetta";
import { useNavigate } from "react-router-dom";
import "../css/CreaRicetta.css";

const CreaRicetta = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ricettaState = useSelector((state) => state.ricetta); //accedo allo stato ricetta
  const token = useSelector((state) => state.auth.token);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isContinueClicked, setIsContinueClicked] = useState(false);

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

  // Fetch categorie
  const fetchCategorie = async () => {
    try {
      if (!token) throw new Error("Token mancante!");

      const response = await fetch(
        "https://capstone-flavor-love-1.onrender.com/api/categorie?page=0&size=100",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("CATEGORIE", data);
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

  // Rimuovo categoria
  const handleRemoveCategory = (categoryToRemove) => {
    setRicettaData((prevData) => ({
      ...prevData,
      nomeCategorieRicette: prevData.nomeCategorieRicette.filter(
        (category) => category !== categoryToRemove
      ),
    }));
  };
  // Gestisco la creazione della ricetta - invio dati all'API e salvo la ricetta creata
  const handleSubmit = async (e) => {
    e.preventDefault();

    //lunghezza titolo
    if(ricettaData.titolo.length < 3 || ricettaData.titolo.length > 60) {
      setAlert({
        message: "Il titolo deve essere compreso tra 3 e 60 caratteri!",
        varianr: "danger",
      });
      return;
    }

    //lunghezza procedomento
    if(ricettaData.procedimento.length > 10000){
      setAlert({
        message:"Il procedimento della ricetta può contenere al massimo 10000 caratteri!",
        variant: "danger",
      });
      return;
    }
    try {
      if (ricettaData.nomeCategorieRicette.length === 0) {
        throw new Error("Seleziona almeno una categoria!");
      }
      // Creazione della ricetta
      const response = await dispatch(creaRicetta(ricettaData));
      if (!response.payload?.id) {
        throw new Error("Errore durante la creazione della ricetta.");
      }
      // Salvo la ricetta creata
      setCreatedRicetta(response.payload);

      //lo stato per mostrare il btn "salva e torna al profilo"
      setIsContinueClicked(true);

      // Resetto il reducer
      dispatch(resetRicetta());

      setAlert({
        message: "Inserisci gli ingredienti!",
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
          //filtro gli ingredienti senza l'id
          const ingredientiNonSalvati = ricettaState.ingredienti.filter(
            (ingrediente) => !ingrediente.id
          );
  
          if (ingredientiNonSalvati.length > 0) {
        // Invio un array di ingredienti
        const ingredientiPayload = ingredientiNonSalvati.map(
          (ingrediente) => ({
            nome: ingrediente.nome,
            dosaggio: ingrediente.dosaggio,
            sezione: ingrediente.sezione,
          })
        );

        await dispatch(addIngredienti(createdRicetta.id, ingredientiPayload));
      }
    }

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

      setIsUploadingImage(true);
      console.log("Caricamento immagine per ricetta ID:", createdRicetta.id);

      // Invio il file tramite addImage
      await dispatch(addImage(createdRicetta.id, file));
      console.log("Immagini nello stato Redux:", ricettaState.image);
      setAlert({
        message: "Immagine caricata con successo!",
        variant: "success",
      });
    } catch (error) {
      console.error("Errore caricamento immagine:", error.message);
      setAlert({ message: error.message, variant: "danger" });
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <div className="creaRicetta_background">
      <Container className="d-flex justify-content-center">
        <div className="creaRicetta-form-container">
          <h2 className="text-center my-4 titolo-creaRicette">
            Crea una nuova ricetta
          </h2>
          {alert.message && (
            <Alert
              variant={alert.variant === "success" ? "success" : "danger"}
              className={`creaRicetta-alert creaRicetta-alert-${alert.variant}`}
            >
              {alert.message}
            </Alert>
          )}
          {/*titolo ricetta */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="titolo fw-bold">Titolo</Form.Label>
              <Form.Control
                type="text"
                name="titolo"
                value={ricettaData.titolo}
                onChange={handleRicettaChange}
                className="creaRicetta-input"
                required
              />

              {/*tempo di preparazione */}
              <Form.Group className="mb-3">
                <Form.Label className="creaRicetta-label mb-0 mt-1">
                  Tempo di preparazione (minuti)
                </Form.Label>
                <Form.Control
                  type="number"
                  name="tempoPreparazioneMinuti"
                  value={ricettaData.tempoPreparazioneMinuti}
                  onChange={handleRicettaChange}
                  className="creaRicetta-input"
                  min="1"
                  required
                />
              </Form.Group>
              {/*tempo di cottura*/}
              <Form.Group className="mb-3">
                <Form.Label className="creaRicetta-label mb-0 mt-1">
                  Tempo di cottura (minuti)
                </Form.Label>
                <Form.Control
                  type="number"
                  name="tempoCotturaMinuti"
                  value={ricettaData.tempoCotturaMinuti}
                  onChange={handleRicettaChange}
                  className="creaRicetta-input"
                  min="0"
                />
              </Form.Group>
              {/*categorie */}
              <Form.Group className="mb-3">
                <Form.Label className="creaRicetta-label mb-0 mt-1">
                  Categoria
                </Form.Label>
                <Form.Select
                  onChange={handleCategoryChange}
                  className="creaRicetta-select"
                  value=""
                >
                  <option value="">Seleziona una categoria</option>
                  {categorie.map((categoria) => (
                    <option key={categoria.nome} value={categoria.nome}>
                      {categoria.nome}
                    </option>
                  ))}
                </Form.Select>
                <div>
                  {ricettaData.nomeCategorieRicette.map((categoria, index) => (
                    <span key={index} className="badge me-2 mt-1">
                      {categoria}
                      <Button
                        variant="link"
                        onClick={() => handleRemoveCategory(categoria)}
                        className="x-btn"
                      >
                        X
                      </Button>
                    </span>
                  ))}
                </div>
              </Form.Group>
              {/*dificolta */}
              <Form.Group className="mb-3">
                <Form.Label className="creaRicetta-label mb-0 mt-1">
                  Difficoltà
                </Form.Label>
                <Form.Select
                  name="difficoltaRicetta"
                  value={ricettaData.difficoltaRicetta}
                  onChange={handleRicettaChange}
                  className="creaRicetta-input"
                  required
                >
                  <option value="FACILE">Facile</option>
                  <option value="MEDIA">Media</option>
                  <option value="DIFFICILE">Difficile</option>
                </Form.Select>
              </Form.Group>
              {/*costo */}
              <Form.Group className="mb-3">
                <Form.Label className="creaRicetta-label mb-0 mt-1">
                  Costo
                </Form.Label>
                <Form.Select
                  name="costoRicetta"
                  value={ricettaData.costoRicetta}
                  onChange={handleRicettaChange}
                  className="creaRicetta-input"
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
              <Form.Label className="creaRicetta-label mb-0 mt-1">
                Procedimento
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                name="procedimento"
                value={ricettaData.procedimento}
                onChange={handleRicettaChange}
                className="creaRicetta-input"
                required
              />
            </Form.Group>

            {/* Invio del form */}
            <div className="mt-4">
              <Button type="submit" className="creaRicetta-btn">
                Continua
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
          {createdRicetta &&
            (isUploadingImage ? (
              <div className="text-center my-3">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Caricamento...</span>
                </Spinner>
              </div>
            ) : (
              <ImgRicetta
                images={ricettaState.image}
                addImage={(file) => handleImageUpload(file)} // Passo l'upload
                removeImage={(imageId) => dispatch(removeImage(createdRicetta.id, imageId))}
                isEditing={false}
              />
            ))}

          {/* salvo ancle l'img. e torno al profilo */}
          {isContinueClicked && (
            <Button
              variant="success"
              className="mt-3 creaRicetta-btn"
              onClick={handleSaveAndNavigate}
            >
              Salva e torna al Profilo
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
};

export default CreaRicetta;
