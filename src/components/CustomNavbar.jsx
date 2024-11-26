import { Navbar, Container, Nav } from 'react-bootstrap'
import { Link, useLocation } from "react-router-dom";
import '../css/CustomNavbar.css';

const CustomNavbar = function () {

  const location = useLocation(); 
  //classe active per i link
  const addActiveOrNot = (path) => {
    return location.pathname === '/' + path ? 'nav-link active' : 'nav-link'
  }

  return (
    <Navbar collapseOnSelect expand="md" className='myNavbar p-0'data-bs-theme="dark">
      <Container fluid>
        <Link to ='/' className="text-decoration-none">
        <Navbar.Brand >
            <img src="/flavor.ico" style={{ width: '70px', height: '55px' }} alt="Logo" />
        </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
          <Link to="/" className={addActiveOrNot('home')}>
             Home
            </Link>
            <Link to="/meteo" className={addActiveOrNot('regioni')}>
              Tutte le Regioni
            </Link>
            <Link to="/mondo" className={addActiveOrNot('mondo')}>
              Mondo
            </Link>
          
          </Nav>
          <Nav className="ms-auto">
          <Link to="/register" className={addActiveOrNot('register')}>
             Registrati
            </Link>
            <Link to="/login" className={addActiveOrNot('login')}>
             Login
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default CustomNavbar