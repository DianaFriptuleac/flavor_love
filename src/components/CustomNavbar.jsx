import { Navbar, Container, Nav, Form, Button, Alert } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DropdownRicettePerCategorie from "./DropdownRicettePerCategorie";
import { useDispatch, useSelector } from "react-redux";
import {
  searchedRicetta,
  searchedRichiesta,
  searchError,
} from "../redux/actions/searchActions";
import { useState } from "react";
import { logoutUser } from "../redux/actions/authActions";
import "../css/CustomNavbar.css";

const CustomNavbar = function () {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const token = useSelector((state) => state.auth.token);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const addActiveOrNot = (path) => {
    return location.pathname === "/" + path ? "nav-link active" : "nav-link";
  };
  //logout
  const handleLogout = () => {
    setShowLogoutAlert(false);
    dispatch(logoutUser());
    navigate("/login");
  };
  //search
  const handleSearch = async () => {
    if (searchQuery.trim().length > 1) {
      try {
        dispatch(searchedRichiesta());
        const response = await fetch(
          `http://localhost:3001/api/ricette/cerca?titolo=${searchQuery}&size=20`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.content && data.content.length > 0) {
          dispatch(searchedRicetta(data.content));
          navigate("/ricette/search");
        } else {
          console.log("Nessun elemento trovato");
          dispatch(searchedRicetta([]));
        }
      } catch (error) {
        console.error("Errore durante la ricerca:", error.message);
        dispatch(searchError(error.message));
      } finally {
        setSearchQuery(""); // svuoto l'input
      }
    } else {
      console.log("La query di ricerca deve essere di almeno 2 caratteri.");
    }
  };

  //search all'enter
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
      <Container fluid className="my-1">
        <Link to="/" className="text-decoration-none">
          <Navbar.Brand>
            <img
              src="/aglio.webp"
              style={{ width: "55px", height: "50px" }}
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
            <Link to="/ristoranti" className={addActiveOrNot("ristoranti")}>
              Ristoranti
            </Link>
            {/*dropdown delle ricette*/}
            <DropdownRicettePerCategorie />
          </Nav>

          {/*search*/}
          <Form className="d-flex">
            <Form.Control
              type="text"
              placeholder="Cerca ricette..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleEnter}
              className="me-2 custom-input"
            />
            <Button
              variant="outline-success"
              className="search-btn"
              onClick={handleSearch}
              // disabilito se meno di 2 caratteri
              disabled={searchQuery.length < 2}
            >
              Cerca
            </Button>
          </Form>
          {/*logout*/}
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <div className="divlogout">
                {/* Bottone per il Logout */}
                <Button
                  // Attivo l'alert di Logout
                  onClick={() => setShowLogoutAlert(true)}
                  className="logout-button"
                >
                  Logout
                </Button>

                {/* Link al profilo utente */}
                <Link
                  to="/userprofile"
                  className={addActiveOrNot("userprofile")}
                >
                  <img src="/assets/user.png" alt="user" className="user_png" />
                </Link>

                {/* Overlay opaco e alert di conferma Logout */}
                {showLogoutAlert && (
                  <>
                    {/* Overlay cliccabile per chiudere l'alert */}
                    <div
                      className="alert-overlay"
                      // Chiudo l'alert cliccando fuori
                      onClick={() => setShowLogoutAlert(false)}
                    ></div>

                    {/* Alert di conferma Logout */}
                    <Alert show={showLogoutAlert} className="mt-3 logout-alert">
                      <Alert.Heading>Conferma Logout</Alert.Heading>
                      <p>Sei sicuro di voler uscire?</p>
                      <div className="d-flex justify-content-between">
                        <Button
                          // Annulla Logout
                          onClick={() => setShowLogoutAlert(false)}
                          className="annulla-logout-button"
                        >
                          Annulla
                        </Button>
                        <Button
                          className="logout-button"
                          // Conferma Logout
                          onClick={handleLogout}
                        >
                          Logout
                        </Button>
                      </div>
                    </Alert>
                  </>
                )}
              </div>
            ) : (
              <>
                {/*register/login*/}
                <Link to="/register" className={addActiveOrNot("register")}>
                  Registrati
                </Link>
                <Link to="/login" className={addActiveOrNot("login")}>
                  Login
                </Link>
                <Link
                  to="/userprofile"
                  className={addActiveOrNot("userprofile")}
                >
                  <img src="/assets/user.png" alt="user" className="user_png" />
                </Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
