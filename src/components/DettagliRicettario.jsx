import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ListGroup, Button, Alert, Container, Pagination } from "react-bootstrap";

const DettagliRicettario = () => {
  const { id } = useParams(); 
  const token = useSelector((state) => state.auth.token);
  const [ricettario, setRicettario] = useState(null);
  const [ricette, setRicette] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchRicettario();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

return (
    <Container>
      <Button onClick={() => navigate("/ricettario")} className="mb-3">
        Torna ai Ricettari
      </Button>
      {ricettario ? (
        <>
          <h2>{ricettario.nome}</h2>
          <ListGroup className="mt-4">
            {ricette.length > 0 ? (
              ricette.map((ricetta) => (
                <ListGroup.Item
                key={ricetta.id}
                action
                  onClick={() => navigate(`/ricette/${ricetta.id}`)}
                >
                  <strong>{ricetta.titolo}</strong>
                  {ricetta.imgUrl && (
                    <img
                      src={ricetta.imgUrl}
                      alt={ricetta.titolo}
                      style={{ width: "100px", marginLeft: "10px" }}
                    />
                  )}
                </ListGroup.Item>
              ))
            ) : (
              <Alert variant="info">Nessuna ricetta trovata in questo ricettario.</Alert>
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
