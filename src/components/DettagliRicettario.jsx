import React, { useEffect, useState } from "react";
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
        `http://localhost:3001/api/ricettari/${id}?page=${page}&size=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("RICETTE", data)
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

  //cancello ricetta dal rricettario
  const handleRemoveRicetta = async (ricettaId) => {
    const conferma = window.confirm(
      "Sei sicuro di voler rimuovere questa ricetta dal ricettario?"
    );
    if (!conferma) return;
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:3001/api/ricettari/${id}/ricette/${ricettaId}`,
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
    <Container>
      <Button onClick={() => navigate("/ricettario")} className="mb-3">
        Torna ai Ricettari
      </Button>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status" className="me-2">
            <span className="visually-hidden">Caricamento...</span>
          </Spinner>
          <span>Caricamento in corso...</span>
        </div>
      ) : ricettario ? (
        <>
          <h2>{ricettario.nome}</h2>
          <ListGroup className="mt-4">
            {ricette.length > 0 ? (
              ricette.map((ricetta) => (
                <ListGroup.Item
                  key={ricetta.id}
                  className="d-flex justify-content-between align-items-center"
                  action
                  onClick={() => navigate(`/ricette/${ricetta.id}`)}
                >
                  <div>
                    {ricetta.imgUrl && (
                      <img
                        src={ricetta.imgUrl}
                        alt={ricetta.titolo}
                        style={{ width: "100px", marginLeft: "10px" }}
                      />
                    )}
                    <strong className="ms-3">{ricetta.titolo}</strong>
                  </div>
                  <div>
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveRicetta(ricetta.id)}
                    >
                      Rimuovi
                    </Button>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <Alert variant="info">
                Nessuna ricetta trovata in questo ricettario.
              </Alert>
            )}
          </ListGroup>
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
  );
};

export default DettagliRicettario;
