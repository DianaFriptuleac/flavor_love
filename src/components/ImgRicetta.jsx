import { Form, Button, ListGroup } from "react-bootstrap";
import { useEffect } from "react";
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
      <h4>Immagini Ricette</h4>
      <Form.Group>
        <Form.Label>Carica Immagine</Form.Label>
        <Form.Control type="file" onChange={handleImageChange} />
      </Form.Group>

      {/* Lista img. */}
      <ListGroup className="mt-3">
        {images.length > 0 ? (
          images.map((img, index) => {
            // Determina l'URL in base al tipo di `img`
            const imageUrl = typeof img === "string" ? img : img.url;

            return (
              <ListGroup.Item
                key={img.id || index}
                className="d-flex justify-content-between align-items-center"
              >
                <img
                  src={imageUrl}
                  alt={`Immagine ${index}`}
                  width="150"
                  style={{ borderRadius: "8px", objectFit: "cover" }}
                />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={
                    () =>
                      isEditing
                        ? removeImage(img.id) // modifica
                        : removeImage(index) // creazione
                  }
                >
                  Rimuovi
                </Button>
              </ListGroup.Item>
            );
          })
        ) : (
          <p>Nessuna immagine caricata.</p>
        )}
      </ListGroup>
    </div>
  );
};
export default ImgRicetta;
