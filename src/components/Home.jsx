import { useEffect, useMemo, useState } from "react";
import { Card, Container, Row, Col, Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../css/Home.css";
import { fetchRicette } from "../redux/actions/fetchRicetteAction";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ricette, loading, error } = useSelector((state) => state.ricette);

  // ****** Ricette esterne (commentate il 29/09//2025 per inserire anche nella home le ricette del DB) ***********

    //const [ricette, setRicette] = useState([]);
 /*   const { ricette, totalPages, currentPage } = useSelector(
      (state) => state.ricette
    ); */

 /*  useEffect(() => {
    fetch(
      "https://capstone-flavor-love-1.onrender.com/api/ricetteEsterne/allRicette?page=0&size=1000"
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.content) {
          const ricetteComplete = data.content.filter(
            (ricetta) => ricetta.title && ricetta.instructions && ricetta.image
          );
          console.log("Ricette con dati completi:", ricetteComplete);
          //salvo le ricette filtrate
          setRicette(ricetteComplete);
        } else {
          console.error("Formato dei dati non valido:", data);
        }
      })
      .catch((error) =>
        console.error("Errore nel caricamento delle ricette:", error)
      );
  }, []); */

  useEffect(() => {
    dispatch(fetchRicette(0, 1000));
  }, [dispatch]);

  //useMemo() -> hook per memorizzare le ricette(se non cambiano). 
  //Evita di ricalcolare le ricette ad ogni render.
  const homeRicette = useMemo(() => {
    const list = Array.isArray(ricette) ? ricette : []; //Verifica che le ricette siano un array
    return list.map((r) =>({    //.map -> trasforma ogni ricetta in un oggetto semplificato
      id: r.id,
      title: r.titolo ?? "No title",
      image: 
      (Array.isArray(r.img) && r.img.length ? (r.img[0]?.url ?? r.img[0]) : null) 
      || "/assets/default_ricetta.jpg", 
    }))
  }, [ricette]);

  //divido le ricette in gruppi da 6
  const carouselRows = (ricette, ricettaPerRow) => {
    const rows = [];
    for (let i = 0; i < ricette.length; i += ricettaPerRow) {
      rows.push(ricette.slice(i, i + ricettaPerRow));
    }
    return rows;
  };

  // Righe da 6 ricette
  const ricetteInRows = carouselRows(homeRicette, 6);

  return (
    <div className="home-background">
      <Container className="mt-5">
        <h1 className="mb-4 text-light homeTitle">Le Nostre Ricette</h1>
        <Carousel interval={null} className="carousel-container">
          {ricetteInRows.map((group, index) => (
            <Carousel.Item key={index}>
              <Row>
                {group.map((ricetta) => (
                  <Col
                    xl={4}
                    md={6}
                    sm={12}
                    xs={12}
                    key={ricetta.id}
                    className="mb-4"
                  >
                    <Card
                      className="ricetta-card"
                     // onClick={() => navigate(`/ricetteEsterne/${ricetta.id}`)} // dettagli ricetta (commentata 29/09/2025)
                     onClick={() => navigate(`/ricette/${ricetta.id}`)}
                    >
                      <div className="img-container">
                        <Card.Img
                          variant="top"
                          src={ricetta.image || "/assets/default_ricetta.jpg"}
                          alt={ricetta.title || "Ricetta"}
                          className="ricetta-img"
                          //X URL dell'img errato o img. che non si carica -> onError x vedere img. di default
                          onError={(e) => {
                            // Previene il loop infinito
                            e.target.onerror = null;
                            e.target.src = "/assets/default_ricetta.jpg";
                          }}
                        />
                        <div className="title-card">
                          <Card.Title className="ricettaTitle">
                            {ricetta.title}
                          </Card.Title>
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </div>
  );
};

export default Home;
