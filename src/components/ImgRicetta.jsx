import { Form, Button, ListGroup } from "react-bootstrap";
import { useEffect } from "react";
import { IoTrash } from "react-icons/io5";
import "../css/CreaRicetta.css";
//passo 3 props-> array img, addimg e remove
const ImgRicetta = ({ images = [], addImage, removeImage, isEditing }) => {
  useEffect(() => {
    console.log("Immagini ricevute nel componente ImgRicetta:", images);
  }, [images]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selezionato:", file);
      addImage(file);
    }
  };

  return (
    <div>
      <h4 className="titolo mt-2">Immagini Ricette</h4>
      <Form.Group>
        <Form.Label className="creaRicetta-label">Carica Immagine:</Form.Label>
        <Form.Control
          className="creaRicetta-input"
          type="file"
          onChange={handleImageChange}
        />
      </Form.Group>

      {/* Lista img. */}
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
                onClick={() => removeImage(img.id)} // creazione
              >
                <IoTrash />
              </Button>
            </ListGroup.Item>
          ))
        ) : (
          <p className="creaRicetta-label">Nessuna immagine caricata.</p>
        )}
      </ListGroup>
    </div>
  );
};

export default ImgRicetta;
