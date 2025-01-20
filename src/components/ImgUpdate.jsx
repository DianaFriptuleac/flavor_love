import { Form, Button, ListGroup } from "react-bootstrap";
import { useEffect } from "react";
import { IoTrash } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { addUpdateImg, removeImage } from "../redux/actions/updateRicettaActions";
import "../css/ModificaRicetta.css";

const ImgUpdate = ({ ricettaId }) => {
  const dispatch = useDispatch();
//stato completo
  const state = useSelector((state) => state);
  console.log("IMG Stato completo di Redux:", state);

  const images = useSelector((state) => state.updateRicetta?.ricetta?.img || []);
  console.log("IMMAGINI letti da Redux:", images);

 

  useEffect(() => {
    console.log("Immagini caricate per la modifica:", images);
  }, [images]);

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selezionato:", file);
      dispatch(addUpdateImg(ricettaId, file));
    }
  };

  // delete img
  const handleRemoveImage = (imageId) => {
    dispatch(removeImage(ricettaId, imageId));
  };

  return (
    <div>
      <h4 className="titolo mt-2">Gestione Immagini</h4>
      
      {/* Caricamento di una nuova immagine */}
      <Form.Group>
        <Form.Label className="modificaRicetta-label">Aggiungi Immagine:</Form.Label>
        <Form.Control
          className="modificaRicetta-input"
          type="file"
          onChange={handleImageChange}
        />
      </Form.Group>

      {/* Lista immagini esistenti */}
      <ListGroup className="mt-3">
        {images.length > 0 ? (
          images.map((img) => (
            <ListGroup.Item
              key={img.id}
              className="d-flex justify-content-between align-items-center"
            >
              <img
                src={img.url}
                alt="immagine ricetta"
                width="150"
                style={{ borderRadius: "8px", objectFit: "cover" }}
              />
              <Button
                className="f-flex align-items-center"
                variant="outline-danger"
                size="sm"
                onClick={() => handleRemoveImage(img.id)}
              >
                <IoTrash />
              </Button>
            </ListGroup.Item>
          ))
        ) : (
          <p className="modificaRicetta-label">Nessuna immagine disponibile.</p>
        )}
      </ListGroup>
    </div>
  );
};

export default ImgUpdate;
