import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
import "../css/SearchResult.css";

const SearchResults = () => {
  const searchResults = useSelector(
    (state) => state.searched?.searchResults || []
  );
  const isLoading = useSelector((state) => state.searched?.isLoading || false);
  const navigate = useNavigate();

  return (
    <div className="search-background">
      <Container>
        <h1 className="search-title">Risultati della Ricerca:</h1>
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Caricamento...</span>
            </Spinner>
          </div>
        ) : searchResults.length > 0 ? (
          <Row className="justify-content-center">
            {searchResults.map((ricetta) => (
              <Col
                key={ricetta.id}
                md={6}
                lg={4}
                xl={3}
                className="d-flex justify-content-center"
              >
                <Card className="mb-3 search-card">
                  <Card.Img
                    variant="top"
                    className="search-card-img"
                    src={ricetta.img[0]?.url || "/assets/default_ricetta.jpg"}
                    alt={ricetta.titolo}
                    key={ricetta.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/ricette/${ricetta.id}`)}
                  />
                  <Card.Body className="p-0">
                    <Card.Title className="search-card-title">
                      {ricetta.titolo}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Col>
            <p className="text-center no-results">
              Nessuna ricetta trovata. Prova un'altra ricerca.
            </p>
          </Col>
        )}
      </Container>
    </div>
  );
};

export default SearchResults;
