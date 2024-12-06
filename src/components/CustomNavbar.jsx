import { Navbar, Container, Nav, Form, Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DropdownRicettePerCategorie from "./DropdownRicettePerCategorie";
import { useDispatch, useSelector } from "react-redux";
import { searchedRicetta } from "../redux/actions/searchActions";
import { useState } from "react";
import "../css/CustomNavbar.css";

const CustomNavbar = function () {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const token = useSelector((state) => state.auth.token);

  const addActiveOrNot = (path) => {
    return location.pathname === "/" + path ? "nav-link active" : "nav-link";
  };

  const handleSearch = async () => {
    if (searchQuery.length > 1) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/ricette/cerca?titolo=${searchQuery}&size=20`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.content && data.content.length > 0) {
            console.log("Dati ricevuti:", data);
            dispatch(searchedRicetta(data.content));
            navigate("/ricette/search");
          } else {
            console.warn("Nessun elemento trovato");
            dispatch(searchedRicetta([]));
          }
        } else {
          console.error("Errore nella ricerca delle ricette");
        }
      } catch (err) {
        console.error("Errore nel fetch delle ricette:", err.message);
      }
    }
    setSearchQuery(""); // Svuoto l'input
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <Navbar
      collapseOnSelect
      expand="md"
      className="myNavbar p-0"
      data-bs-theme="dark"
    >
      <Container fluid>
        <Link to="/" className="text-decoration-none">
          <Navbar.Brand>
            <img
              src="/flavor.ico"
              style={{ width: "70px", height: "55px" }}
              alt="Logo"
            />
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Link to="/" className={addActiveOrNot("home")}>
              Home
            </Link>
            <DropdownRicettePerCategorie />
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="text"
              placeholder="Cerca ricette..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleEnter}
              className="me-2"
            />
            <Button
              variant="outline-secondary"
              onClick={handleSearch}
              disabled={searchQuery.length < 2} // Disabilita se meno di 2 caratteri
            >
              Cerca
            </Button>
          </Form>
          <Nav className="ms-auto">
            <Link to="/register" className={addActiveOrNot("register")}>
              Registrati
            </Link>
            <Link to="/login" className={addActiveOrNot("login")}>
              Login
            </Link>
            <Link to="/userprofile" className={addActiveOrNot("userprofile")}>
              <img src="/assets/user.png" alt="user" className="user_png" />
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
