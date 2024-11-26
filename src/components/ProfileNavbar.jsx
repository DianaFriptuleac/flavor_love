import { Navbar, Container, Nav } from 'react-bootstrap'
import { Link, useLocation } from "react-router-dom";
import '../css/CustomNavbar.css';

const ProfileNavbar = function () {

  const location = useLocation(); 
  //classe active per i link
  const addActiveOrNot = (path) => {
    return location.pathname === '/' + path ? 'nav-link active' : 'nav-link'
  }

  return (
    <Navbar collapseOnSelect expand="md" className='myNavbar' data-bs-theme="dark">
      <Container fluid>
        <Link to ='/' className="text-decoration-none">
        <Navbar.Brand >
            <img src="/flavor.ico" style={{ width: '80px', height: '55px' }} alt="Logo" />
        </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
          <Link to="/" className={addActiveOrNot('home')}>
             Home
            </Link>
            <Link to="/registrati" className={addActiveOrNot('regioni')}>
              Registrati
            </Link>
            <Link to="/login" className={addActiveOrNot('mondo')}>
              Login
            </Link>
            <Link to="/notizie" className={addActiveOrNot('notizie')}>
             Registrati/Login
            </Link>
          </Nav>
          <Nav className="ms-auto">
            <Link to="/daaggiornare" className={addActiveOrNot('settings')}><i className="bi bi-bell-fill"></i></Link>
            <Link to="/daaggiornare" className={addActiveOrNot('profile')}><i className="bi bi-person-circle icons"></i></Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default ProfileNavbar