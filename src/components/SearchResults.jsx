
import { useSelector } from "react-redux";
import { Card, Container, Row, Col } from "react-bootstrap";

const SearchResults = () => {
  const searchResults = useSelector((state) => state.searched?.searchResults || []);

  return (
    <Container>
      <Row>
        {searchResults.length > 0 ? (
          searchResults.map((ricetta) => (
            <Col key={ricetta.id} md={4}>
              <Card className="mb-3">
                <Card.Img
                  variant="top"
                  src={ricetta.img[0]?.url || "/assets/default_ricetta.jpg"}
                  alt={ricetta.titolo}
                />
                <Card.Body>
                <Card.Title>{ricetta.titolo}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-center">Nessuna ricetta trovata. Prova un'altra ricerca.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default SearchResults;


