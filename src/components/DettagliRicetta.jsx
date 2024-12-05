import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDettagliRicetta } from "../redux/actions/fetchRicetteAction";
import { Container, Card, Button, Alert, ListGroup } from "react-bootstrap";
import { useState } from "react";

const DettagliRicetta = () => {
  const { id } = useParams(); // ottengo id ricetta
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { dettagli, loading, error } = useSelector((state) => state.ricette);
  const userId = useSelector((state) => state.auth.user?.id); //id utente
  const token = useSelector((state) => state.auth.token); // token
  const [alert, setAlert] = useState({ message: "", variant: "" });
  

  const handleDelete = async () => {
    const confermaDelete = window.confirm(
      "Sei sicuro di voler cancellare questa ricetta?"
    );
    if (!confermaDelete) return;
    try {
      const response = await fetch(`http://localhost:3001/api/ricette/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAlert({
          message: "Ricetta cancellata con successo.",
          variant: "success",
        });

        navigate("/userprofile");
      } else {
        throw new Error("Errore nella cancellazione della ricetta");
      }
    } catch (error) {
      console.error("Errore:", error.message);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchDettagliRicetta(id)); // Fetch dettagli ricetta
    }
  }, [dispatch, id]);

  if (loading) {
    return <Alert variant="danger">Caricamento dettagli ricetta...</Alert>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!dettagli) {
    return <Alert variant="info">Nessuna ricetta trovata.</Alert>;
  }
  
  console.log("ID utente loggato:", userId);
  console.log("ID creatore ricetta:", dettagli.utente?.id);
  return (
    <Container>
      <Card className="mt-3">
        <Card.Img
          variant="top"
          src={dettagli.img?.[0]?.url || "/assets/default_ricetta.jpg"}
          alt={dettagli.titolo}
        />
        <Card.Body>
          <Card.Title>{dettagli.titolo}</Card.Title>
          <Card.Text>
            <strong>Procedimento:</strong> {dettagli.procedimento}
          </Card.Text>
          <Card.Text>
            <strong>Difficoltà:</strong> {dettagli.difficoltaRicetta}
          </Card.Text>
          <Card.Text>
            <strong>Tempo di Preparazione:</strong>{" "}
            {dettagli.tempoPreparazioneMinuti} minuti
          </Card.Text>
          <Card.Text>
            <strong>Tempo di Cottura:</strong> {dettagli.tempoCotturaMinuti}{" "}
            minuti
          </Card.Text>
          <Card.Text>
            <strong>Costo:</strong> {dettagli.costoRicetta}
          </Card.Text>
          <strong>Ingredienti:</strong>
          <ListGroup className="mb-3">
            {(dettagli.ingredienti || []).map((ing, index) => (
              <ListGroup.Item key={ing.id}>
                {ing.nome} {ing.dosaggio}
              </ListGroup.Item>
            ))}
          </ListGroup>

          {dettagli.utente?.id === userId ? (
            // Mostra solo se e creatore

            <div className="d-flex justify-content-between">
              <Button
                variant="warning"
                onClick={() => navigate(`/ricette/${id}/update`)}
              >
                Modifica
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Cancella
              </Button>
            </div>
          ) : null}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DettagliRicetta;
