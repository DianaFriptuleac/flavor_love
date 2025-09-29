import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ListGroup,
  Button,
  Alert,
  Container,
  Pagination,
  Spinner,
} from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import "../css/DettagliRicettario.css";

const DettagliRicettario = () => {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.token);
  const [ricettario, setRicettario] = useState(null);
  const [ricette, setRicette] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch dettagli ricettario
  const fetchRicettario = async (page = 0) => {
    try {
      const response = await fetch(
        `https://capstone-flavor-love-1.onrender.com/api/ricettari/${id}?page=${page}&size=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        //console.log("RICETTE", data);
        setRicettario(data);
        setRicette(data.ricetta.content || []);
        setTotalPages(data.ricetta.totalPages || 0);
        setCurrentPage(data.ricetta.number || 0);
      } else {
        throw new Error("Errore nel caricamento del ricettario.");
      }
    } catch (error) {
      console.error("Errore:", error.message);
    }
  };

  //cancello ricetta dal ricettario
  const handleRemoveRicetta = async (ricettaId) => {
    const conferma = window.confirm(
      "Sei sicuro di voler rimuovere questa ricetta dal ricettario?"
    );
    if (!conferma) {
      return;
    }

    try {
      const response = await fetch(
        `https://capstone-flavor-love-1.onrender.com/api/ricettari/${id}/ricette/${ricettaId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        // aggiorno lo stato locale e rimuovo ricetta
        setRicette((prevRicette) =>
          prevRicette.filter((ricetta) => ricetta.id !== ricettaId)
        );
        alert("Ricetta rimossa con successo.");
        navigate("/ricettario");
      } else {
        alert("Errore nella rimozione della ricetta.");
      }
    } catch (error) {
      console.error("Errore nella rimozione della ricetta:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRicettario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="dettagli-ricettario">
      <Container>
        <div className="mb-3">
          <Button
            onClick={() => navigate("/ricettario")}
            className="mt-3 tornaBtn"
          >
            Torna ai Ricettari
          </Button>
        </div>
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center">
            <Spinner animation="border" role="status" className="me-2">
              <span className="visually-hidden">Caricamento...</span>
            </Spinner>
            <span>Caricamento in corso...</span>
          </div>
        ) : ricettario ? (
          <>
            <h2 className="nome-ricettarrio">{ricettario.nome}</h2>
            <div className="listaRicetteContainer">
              <ListGroup className="mt-3">
                {ricette.length > 0 ? (
                  ricette.map((ricetta) => (
                    <ListGroup.Item
                      key={ricetta.id}
                      className="d-flex justify-content-between align-items-center listRicette mb-2"
                      action
                      onClick={() => navigate(`/ricette/${ricetta.id}`)}
                    >
                      <div className="img-title-container">
                        {ricetta.imgUrl && (
                          <img
                            className="img-lista"
                            src={ricetta.imgUrl}
                            alt={ricetta.titolo}
                          />
                        )}
                        <strong className="ms-3 ricetta-title">
                          {ricetta.titolo}
                        </strong>
                      </div>
                      <div>
                        <Button
                          className="rimuovi-btn"
                          onClick={(event) => {
                            event.stopPropagation(); // evito che il click sul btn attivi il click sul genitore (ricetta.id)
                            handleRemoveRicetta(ricetta.id);
                          }}
                        >
                          <FaTrashAlt />
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))
                ) : (
                  <Alert className="ricettario-custom-alert">
                    Nessuna ricetta trovata in questo ricettario.
                  </Alert>
                )}
              </ListGroup>
            </div>
            {totalPages > 1 && (
              <Pagination className="mt-3">
                {[...Array(totalPages).keys()].map((page) => (
                  <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => fetchRicettario(page)}
                  >
                    {page + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            )}
          </>
        ) : (
          <Alert variant="warning">Caricamento ricettario in corso...</Alert>
        )}
      </Container>
    </div>
  );
};

export default DettagliRicettario;
