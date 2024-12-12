import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateRicetta,
  removeImage,
  fetchImagesByRicettaId,
} from "../redux/actions/updateRicettaActions";
import { addImage } from "../redux/actions/creaRicetta";
import { fetchDettagliRicetta } from "../redux/actions/fetchRicetteAction";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import IngredientiRicetta from "./IngredientiRicetta";

import ImgRicetta from "./ImgRicetta";
import {
  addIngredienti,
  removeIngrediente,
} from "../redux/actions/creaRicetta";
import "../css/ModificaRicetta.css";

const ModificaRicetta = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { dettagli, loading, error } = useSelector((state) => state.ricette);

  const ingredienti = useSelector(
    (state) => state.ricette.ingredienti || []
  );
  const images = useSelector((state) => state.ricette.dettagli?.img || []);
  const token = useSelector((state) => state.auth.token);

  const [formData, setFormData] = useState({
    titolo: "",
    procedimento: "",
    difficoltaRicetta: "FACILE",
    tempoPreparazioneMinuti: 1,
    tempoCotturaMinuti: 0,
    costoRicetta: "BASSO",
    nomeCategorieRicette: [],
    ingredienti: [],
     img: [],
  });

  const [categorie, setCategorie] = useState([]);
  const [alert, setAlert] = useState({ message: "", variant: "" });
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch dettagli ricetta
  useEffect(() => {
    if (id) {
      dispatch(fetchDettagliRicetta(id));
      dispatch(fetchImagesByRicettaId(id));
    }
  }, [dispatch, id]);

  // Popolo il form con i dettagli ricetta
  useEffect(() => {
    if (dettagli) {
      setFormData({
        ...formData,
        titolo: dettagli.titolo,
        procedimento: dettagli.procedimento,
        difficoltaRicetta: dettagli.difficoltaRicetta,
        tempoPreparazioneMinuti: dettagli.tempoPreparazioneMinuti,
        tempoCotturaMinuti: dettagli.tempoCotturaMinuti,
        costoRicetta: dettagli.costoRicetta,
        nomeCategorieRicette: dettagli.categorie || [],
        ingredienti: dettagli.ingredienti || [],
        img:dettagli.img || [],
      });
    }
    console.log("Stato aggiornato:", dettagli?.img);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dettagli]);

  //gestisco le immagini
  const handleImageAdd = async (file) => {
    setIsProcessing(true);
    try {
      await dispatch(addImage(id, file));
      dispatch(fetchImagesByRicettaId(id));
     // console.log("IMG MODIFICA",id, "FILE",file )
      setIsProcessing(false);
    } catch (error) {
      console.error("Errore aggiunta immagine:", error.message);
      setIsProcessing(false);
    }
  };

  // Fetch categorie
  useEffect(() => {
    const fetchCategorie = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/categorie?page=0&size=100",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCategorie(data.content || []);
        } else {
          throw new Error("Errore nel recupero delle categorie");
        }
      } catch (err) {
        console.error("Errore nel fetch delle categorie:", err.message);
      }
    };

    fetchCategorie();
  }, [token]);

  // Gestisco l'input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("tempo") ? parseInt(value, 10) || 0 : value,
    }));
  };

  // Aggiungo categoria
  const handleAddCategory = (e) => {
    const selectedCategoryName = e.target.value;
    const selectedCategory = categorie.find(
      (cat) => cat.nome === selectedCategoryName
    );
  
    if (
      selectedCategory &&
      !formData.nomeCategorieRicette.some((cat) => cat.nome === selectedCategory.nome)
    ) {
      setFormData((prev) => ({
        ...prev,
        nomeCategorieRicette: [...prev.nomeCategorieRicette, selectedCategory],
      }));
    }
  };

  // Rimuovo categoria
  const handleRemoveCategory = (categoryToRemove) => {
    setFormData((prev) => ({
      ...prev,
      nomeCategorieRicette: prev.nomeCategorieRicette.filter(
        (category) => category.nome !== categoryToRemove.nome
      ),
    }));
  };

  // Salvo modifiche
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const payload = {
        ...formData,
        nomeCategorieRicette: formData.nomeCategorieRicette.map(
          (categoria) => categoria.nome
        ),
      };
      const response = await dispatch(updateRicetta(id, payload));
      if (response.payload) {
        setAlert({
          message: "Ricetta aggiornata con successo!",
          variant: "success",
        });
        navigate(`/ricette/${id}`);
      } else {
        throw new Error("Errore durante l'aggiornamento della ricetta.");
      }
    } catch (error) {
      setAlert({ message: error.message, variant: "danger" });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <Spinner animation="border" role="status" />
        <span className="ms-2">Caricamento...</span>
      </div>
    );
  }
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="modificaRicetta_background">
      <Container className="d-flex justify-content-center">
        <div className="modificaRicetta-form-container">
          <h2 className="text-center my-4 titolo-modificaRicette">
            Modifica Ricetta
          </h2>
          {alert.message && (
            <Alert
              variant={alert.variant === "success" ? "success" : "danger"}
              className={`modificaRicetta-alert modificaRicetta-alert-${alert.variant}`}
            >
              {alert.message}
            </Alert>
          )}
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label className="titoloRosso">Titolo</Form.Label>
              <Form.Control
                type="text"
                name="titolo"
                value={formData.titolo}
                onChange={(e) =>
                  setFormData({ ...formData, titolo: e.target.value })
                }
                className="modificaRicetta-input"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="titolo-label fw-bold">
                Procedimento
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="procedimento"
                value={formData.procedimento}
                onChange={handleChange}
                className="modificaRicetta-input"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="titolo-label fw-bold">
                Categoria
              </Form.Label>
              <Form.Select
                className="modificaRicetta-input"
                onChange={handleAddCategory}
                value=""
              >
                <option value="">Seleziona una categoria</option>
                {categorie.map((categorie) => (
                  <option key={categorie.nome} value={categorie.nome}>
                    {categorie.nome}
                  </option>
                ))}
              </Form.Select>
              {formData.nomeCategorieRicette.map((categorie, index) => (
               
                <span
                  key={index}
                  className="badge me-2 mt-1"
                >
                  {categorie.nome}
                  <Button
                    variant="link"
                    onClick={() => handleRemoveCategory(categorie)}
                    className="x-btn"
                  >
                    X
                  </Button>
                </span>
              
              ))}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="titolo-label fw-bold">
                Difficoltà
              </Form.Label>
              <Form.Select
                name="difficoltaRicetta"
                value={formData.difficoltaRicetta}
                onChange={handleChange}
              >
                <option value="FACILE">Facile</option>
                <option value="MEDIA">Media</option>
                <option value="DIFFICILE">Difficile</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="titolo-label fw-bold">
                Tempo di Preparazione (minuti)
              </Form.Label>
              <Form.Control
                className="modificaRicetta-input"
                type="number"
                name="tempoPreparazioneMinuti"
                value={formData.tempoPreparazioneMinuti}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="titolo-label fw-bold">
                Tempo di Cottura (minuti)
              </Form.Label>
              <Form.Control
                className="modificaRicetta-input"
                type="number"
                name="tempoCotturaMinuti"
                value={formData.tempoCotturaMinuti}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="titolo-label fw-bold">Costo</Form.Label>
              <Form.Select
                className="modificaRicetta-input"
                name="costoRicetta"
                value={formData.costoRicetta}
                onChange={handleChange}
              >
                <option value="BASSO">Basso</option>
                <option value="MEDIO">Medio</option>
                <option value="ALTO">Alto</option>
              </Form.Select>
            </Form.Group>

            {/* Ingredienti */}
            {id && (
              <IngredientiRicetta
                ricettaId={id}
                ingredienti={ingredienti}
                addIngrediente={(ingrediente) =>
                  dispatch(addIngredienti(id, [ingrediente]))
                }
                removeIngrediente={(ingredienteId) =>
                  dispatch(removeIngrediente(id, ingredienteId))
                }
              />
            )}

            {/* ImgRicetta */}
            {id && (
              <Form.Group className="mb-3">
                <ImgRicetta
                  images={images} 
                  addImage={handleImageAdd}
                  removeImage={(imageId) => dispatch(removeImage(id, imageId))}
                  isEditing={true}
                />
              </Form.Group>
            )}
            <Button className="salva-btn" type="submit" disabled={isProcessing}>
              {isProcessing ? "Salvataggio..." : "Salva Modifiche"}
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
};
export default ModificaRicetta;
