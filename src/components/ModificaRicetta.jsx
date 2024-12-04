import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateRicetta,
  addImage,
  removeImage,
  fetchImagesByRicettaId
} from "../redux/actions/updateRicettaActions";
import { fetchDettagliRicetta } from "../redux/actions/fetchRicetteAction";
import { Container, Form, Button, Alert} from "react-bootstrap";
import IngredientiRicetta from "./IngredientiRicetta";


import ImgRicetta from "./ImgRicetta";
import { addIngredienti } from "../redux/actions/creaRicetta";


const ModificaRicetta = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { dettagli, loading, error } = useSelector((state) => state.ricette);
  const images = useSelector((state) => state.ricette.dettagli?.img || []);
  const ingredienti = useSelector((state) => state.ricette.dettagli?.ingredienti || []);
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
        titolo: dettagli.titolo,
        procedimento: dettagli.procedimento,
        difficoltaRicetta: dettagli.difficoltaRicetta,
        tempoPreparazioneMinuti: dettagli.tempoPreparazioneMinuti,
        tempoCotturaMinuti: dettagli.tempoCotturaMinuti,
        costoRicetta: dettagli.costoRicetta,
        nomeCategorieRicette: dettagli.nomeCategorieRicette || [],
        ingredienti: dettagli.ingredienti || [],
    
      });
    }
  }, [dettagli]);

  // Fetch categorie
  useEffect(() => {
    const fetchCategorie = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/categorie", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

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
    const selectedCategory = e.target.value;
    if (selectedCategory && !formData.nomeCategorieRicette.includes(selectedCategory)) {
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
        (category) => category !== categoryToRemove
      ),
    }));
  };


  // Salvo modifiche
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(updateRicetta(id, formData));
      if (response.payload) {
        setAlert({ message: "Ricetta aggiornata con successo!", variant: "success" });
        navigate(`/ricette/${id}`);
      } else {
        throw new Error("Errore durante l'aggiornamento della ricetta.");
      }
    } catch (error) {
      setAlert({ message: error.message, variant: "danger" });
    }
  };

  if (loading) return <Alert variant="info">Caricamento dettagli ricetta...</Alert>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container>
      <h2>Modifica Ricetta</h2>
      {alert.message && <Alert variant={alert.variant}>{alert.message}</Alert>}
      <Form onSubmit={handleUpdate}>
        <Form.Group className="mb-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            type="text"
            name="titolo"
            value={formData.titolo}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Procedimento</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            name="procedimento"
            value={formData.procedimento}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Select onChange={handleAddCategory} value="">
            <option value="">Seleziona una categoria</option>
            {categorie.map((categoria) => (
              <option key={categoria.nome} value={categoria.nome}>
                {categoria.nome}
              </option>
            ))}
          </Form.Select>
          <div>
            {formData.nomeCategorieRicette.map((categoria, index) => (
              <span key={index} className="badge bg-secondary me-2">
                {categoria}
                <Button
                  variant="link"
                  onClick={() => handleRemoveCategory(categoria)}
                  className="text-danger"
                >
                  x
                </Button>
              </span>
            ))}
          </div>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Difficoltà</Form.Label>
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
          <Form.Label>Tempo di Preparazione (minuti)</Form.Label>
          <Form.Control
            type="number"
            name="tempoPreparazioneMinuti"
            value={formData.tempoPreparazioneMinuti}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Tempo di Cottura (minuti)</Form.Label>
          <Form.Control
            type="number"
            name="tempoCotturaMinuti"
            value={formData.tempoCotturaMinuti}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Costo</Form.Label>
          <Form.Select
            name="costoRicetta"
            value={formData.costoRicetta}
            onChange={handleChange}
          >
            <option value="BASSO">Basso</option>
            <option value="MEDIO">Medio</option>
            <option value="ALTO">Alto</option>
          </Form.Select>
        </Form.Group>
        <Button type="submit">Salva Modifiche</Button>
      </Form>
     {/* Ingredienti */}
     {id && (
          <IngredientiRicetta
            ricettaId={id}
            ingrediente={ingredienti}
            addIngrediente={(ingrediente) =>
              dispatch(addIngredienti(id, [ingrediente]))
            }
            removeIngrediente={(ingredienteId) =>
              dispatch(removeImage(id, ingredienteId))
            }
          />
        )}

        {/* ImgRicetta */}
        {id && (
          <Form.Group className="mb-3">
            <Form.Label>Immagini</Form.Label>
            <ImgRicetta
              images={images}
              addImage={(file) => dispatch(addImage(id, file))}
              removeImage={(index) => {
                const imageId = images[index]?.id;
                if (imageId) dispatch(removeImage(id, imageId));
              }}
            />
          </Form.Group>
        )}
    </Container>
  );
};
export default ModificaRicetta;

