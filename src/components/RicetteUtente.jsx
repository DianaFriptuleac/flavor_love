import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Alert, Button, Carousel } from "react-bootstrap";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRicetteUtente } from "../redux/actions/fetchRicetteAction";
import "../css/RicetteUtente.css";


const RicetteUtente = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const ricette = useSelector((state) => state.ricette.ricetteUtente);
  console.log("Ricette visualizzate nel componente:", ricette);

  const auth = useSelector((state) => state.auth);

  console.log("Stato auth nel componente RicetteUtente:", auth);

  useEffect(() => {
    if (auth.token && auth.user?.id) {
      dispatch(fetchRicetteUtente());
    }
  }, [auth.token, auth.user?.id, dispatch]);
  
  //divido le ricette 
  const divRicette = (array, size) =>{
    const res=[];
    for(let i = 0; i< array.length; i += size){
      res.push(array.slice(i, i + size));
    }
    return res;
  }

  const gruppiRicette = divRicette(ricette, 6);
  
  return (
    <Container>
      <div className="d-flex justify-content-between my-1">
        <h2 className="ricetteUtenteTitle mb-0">Le tue ricette:</h2>
        <Button className="creaRicetta-btn" onClick={() => navigate("/creaRicetta")}>
          Crea Ricetta
        </Button>
      </div>
      {ricette.length > 0 ? (
        <Row>
          <Col md={6} lg={10}>
         <Carousel>
         {gruppiRicette.map((gruppo, index) => (
           <Carousel.Item key={index}>
             <div className="d-flex flex-wrap justify-content-center">
               {gruppo.map((ricetta) => (
                 <Card
                   key={ricetta.id}
                   className="m-2"
                   style={{ width: "18rem", cursor: "pointer" }}
                   onClick={() => navigate(`/ricette/${ricetta.id}`)}
                 >
                   <Card.Img
                     variant="top"
                     src={
                       (ricetta.img &&
                         ricetta.img.length > 0 &&
                         ricetta.img[0].url) ||
                       "/assets/default_ricetta.jpg"
                     }
                     alt={ricetta.titolo}
                   />
                   <Card.Body>
                     <Card.Title>{ricetta.titolo}</Card.Title>
                   </Card.Body>
                 </Card>
               ))}
             </div>
           </Carousel.Item>
         ))}
       </Carousel>
       </Col>
        </Row>
      ) : (
        <Alert variant="info" className="text-center mt-4">
          Nessuna ricetta creata. Inizia a creare la tua prima ricetta!
        </Alert>
      )}
    </Container>
  );
};

export default RicetteUtente;
