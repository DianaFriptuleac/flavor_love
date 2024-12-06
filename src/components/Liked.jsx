import { useSelector, useDispatch } from "react-redux";
import { Container, Alert, Row, Col, Card, Button } from "react-bootstrap";
import { likedRicette as toggleLikedRicetteAction } from "../redux/actions/likedActions";
import { FaHeart } from "react-icons/fa";

const Liked = () => {
  const dispatch = useDispatch();
  const likedRicetteState = useSelector((state) => state.liked.ricette);

  const toggleLike = (ricetta) => {
    dispatch(toggleLikedRicetteAction(ricetta));
  };

  if (!likedRicetteState.length) {
    return (
      <Container>
        <Alert variant="info">
          Non hai ancora aggiunto ricette ai preferiti.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h2>Le tue ricette preferite</h2>
      <Row>
        {likedRicetteState.map((ricetta) => (
          <Col key={ricetta.id} md={4}>
            <Card className="mb-4">
              <Card.Img
                variant="top"
                src={ricetta.img[0]?.url || "/assets/default_ricetta.jpg"}
              />
              <Card.Body>
                <Card.Title>{ricetta.titolo}</Card.Title>
                <Button
                  variant="light"
                  onClick={() => toggleLike(ricetta)}
                  style={{ color: "red" }}
                >
                  <FaHeart />
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Liked;
