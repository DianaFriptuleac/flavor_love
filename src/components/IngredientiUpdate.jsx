import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  addIngredientiUp,
  removeIngredienteUp,
  fetchIngredientiByRicettaId,
} from "../redux/actions/updateRicettaActions";
import { Form, Button, ListGroup } from "react-bootstrap";
import { IoTrash } from "react-icons/io5";
import { useEffect } from "react";
import "../css/ModificaRicetta.css";

const IngredientiUpdate = ({ ricettaId }) => {
  const dispatch = useDispatch();
  const [newIngrediente, setNewIngrediente] = useState({
    nome: "",
    dosaggio: "",
    sezione: "",
  });
  const [currentSezione, setCurrentSezione] = useState("");
  const [message, setMessage] = useState("");
  const [sectionMode, setSectionMode] = useState("existing"); // existing / new
  const [selectedSection, setSelectedSection] = useState("");
  const [renameFrom, setRenameFrom] = useState("");
  const [renameTo, setRenameTo] = useState("");

  
  const fetchedIngredienti = useSelector((state) => state.updateRicetta?.ingredienti || []);
 // console.log("Ingredienti letti da Redux:", fetchedIngredienti);
  
  
  
  const state = useSelector((state) => state.updateRicetta.ingredienti);
//  console.log("Stato completo di Redux:", state);

  // Agg. un ingrediente
  const handleAdd = () => {
    const sezioneSelezionata = sectionMode === "existing" ? selectedSection : currentSezione.trim();
    if (
      !sezioneSelezionata ||
      !newIngrediente.nome.trim() ||
      !newIngrediente.dosaggio.trim()
    ) {
      setMessage("Completa tutti i campi!");
      return;
    }

    const ingrediente = { ...newIngrediente, sezione: sezioneSelezionata };
    dispatch(addIngredientiUp(ricettaId, [ingrediente]))
      .then(() => {
        dispatch(fetchIngredientiByRicettaId(ricettaId));
        setMessage("Ingrediente aggiunto con successo!");
        setNewIngrediente({ nome: "", dosaggio: "", sezione: "" });
      })
      .catch((error) => {
        setMessage("Errore durante l'aggiunta dell'ingrediente.", error);
      });
  };

  // Rimuovo un ingrediente
  const handleDelete = (ingredienteId) => {
    dispatch(removeIngredienteUp(ricettaId, ingredienteId))
      .then(() => {
        dispatch(fetchIngredientiByRicettaId(ricettaId));
        setMessage("Ingrediente rimosso con successo!");
      })
      .catch((error) => {
        setMessage("Errore durante la rimozione dell'ingrediente.", error);
      });
  };

  // ingredienti per sezione
  const groupedIngredients = fetchedIngredienti.reduce((acc, curr) => {
    if (!acc[curr.sezione]) {
      acc[curr.sezione] = [];
    }
    acc[curr.sezione].push(curr);
    return acc;
  }, {});

  useEffect(() => {
    dispatch(fetchIngredientiByRicettaId(ricettaId));
  }, [dispatch, ricettaId]);
  
/*   if (!fetchedIngredienti || fetchedIngredienti.length === 0) {
    return <div>Caricamento ingredienti...</div>;
  }
   */
  
  // elenco sezioni esistenti
  const section = Array.from(
    new Set((fetchedIngredienti || [])
  .map(i=>i.sezione).filter(Boolean))
  )
  
  //se non ci sono sezioni -> new
  useEffect(() => {
    if(section.length === 0){
      setSectionMode("new");
      setSelectedSection("");
    } else if(!selectedSection){
      setSelectedSection(section[0]);
    }
  }, [section.length]);

  return (
    <div>
      <h4 className="mt-3">Ingredienti:</h4>
      {message && <div className="alert alert-success">{message}</div>}

      {/* Form per aggiungere un ingrediente */}
      <Form.Group className="mb-3">
        <Form.Label>Sezione</Form.Label>
        <div className="ingredienti_update">
        <Form.Check
        type="radio"
         name="sectionMode"
         id="section-existing"
         label="Seleziona una sezione esistente"
         checked={sectionMode === "existing"}
         disabled={section.length === 0}
          onChange={() => setSectionMode("existing")}
        />
          <Form.Check
            type="radio"
            name="sectionMode"
            id="section-new"
            label="Crea nuova sezione"
            checked={sectionMode === "new"}
            onChange={() => setSectionMode("new")}
          />
       

        {sectionMode === "existing" ? (
          <Form.Select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            {section.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Form.Select>
        ) : (
          <Form.Control
            type="text"
            placeholder="Nuova sezione (es. Impasto, Crema...)"
            value={currentSezione}
            onChange={(e) => setCurrentSezione(e.target.value)}
          />
        )}
         </div>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Nome</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nome ingrediente"
          value={newIngrediente.nome}
          onChange={(e) =>
            setNewIngrediente({ ...newIngrediente, nome: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Dosaggio</Form.Label>
        <Form.Control
          type="text"
          placeholder="Dosaggio (es. 500g)"
          value={newIngrediente.dosaggio}
          onChange={(e) =>
            setNewIngrediente({ ...newIngrediente, dosaggio: e.target.value })
          }
        />
      </Form.Group>
      <Button className="salva-btn" onClick={handleAdd}>
        Aggiungi Ingrediente
      </Button>

      {/* Lista di ingredienti raggruppati per sezione */}
      {Object.entries(groupedIngredients).map(([sezione, ingredienti]) => (
        <div key={sezione} className="mt-4">
          <h5>Sezione: {sezione}</h5>
          <ListGroup>
            {ingredienti.map((ingrediente) => (
              <ListGroup.Item
                key={ingrediente.id}
                className="d-flex justify-content-between align-items-center"
              >
                {`${ingrediente.nome} - ${ingrediente.dosaggio}`}
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(ingrediente.id)}
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

export default IngredientiUpdate;
