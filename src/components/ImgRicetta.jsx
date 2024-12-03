import { Form, Button, ListGroup } from "react-bootstrap";
//passo 3 pprops-> array img, addimg e remove
const ImgRicetta = ({ images = [], addImage, removeImage }) => {
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
      {/*Lista img. con il btn per cancellare */}
      <ListGroup className="mt-3">
        {images.map((img, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex justify-content-between align-items-center"
          >
            {typeof img === "string" ? (
              <img src={img} alt={`Immagine ${index}`} width="100" />
            ) : (
              img instanceof Blob && (
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Immagine ${index}`}
                  width="100"
                />
              )
            )}
            <Button
              variant="danger"
              size="sm"
              onClick={() => removeImage(index)}
            >
              Rimuovi
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default ImgRicetta;
