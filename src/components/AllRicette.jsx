import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRicette } from "../redux/actions/fetchRicetteAction";
import { Container, Card, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Pagination } from "react-bootstrap";

const AllRicette = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { ricette, totalPages, currentPage } = useSelector((state) => state.ricette);
  
    useEffect(() => {
      dispatch(fetchRicette(0)); // Fetch della prima pagina
    }, [dispatch]);
  
    const handlePageChange = (page) => {
      dispatch(fetchRicette(page));
    };
  
    return (
      <Container>
        <h2 className="mt-4">Tutte le Ricette</h2>
        <Row className="mt-3">
          {Array.isArray(ricette) && ricette.length > 0 ? (
            ricette.map((ricetta) => (
              <Col key={ricetta.id} md={4} className="mb-4">
                <Card onClick={() => navigate(`/ricette/${ricetta.id}`)} className="cursor-pointer">
                  <Card.Img
                    variant="top"
                    src={
                      ricetta.img && ricetta.img.length > 0
                        ? ricetta.img[0].url
                        : "/assets/default_ricetta.jpg"
                    }
                    alt={ricetta.titolo}
                  />
                  <Card.Body>
                    <Card.Title>{ricetta.titolo}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Alert variant="info">Nessuna ricetta trovata.</Alert>
          )}
        </Row>
        <Pagination className="justify-content-center mt-4">
          {totalPages > 0 &&
            [...Array(totalPages).keys()].map((page) => (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => handlePageChange(page)}
              >
                {page + 1}
              </Pagination.Item>
            ))}
        </Pagination>
      </Container>
    );
  };
  
  export default AllRicette;