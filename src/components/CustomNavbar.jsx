import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import { Link, useLocation} from "react-router-dom";
import '../css/CustomNavbar.css';

const CustomNavbar = function () {

  const location = useLocation(); 
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
            <NavDropdown title="Ricette" id="collapsible-nav-dropdown" className='nav-dropdown'>
              <NavDropdown.Item href="#action/3.1">Antipasti</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
               Primi
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Secondi</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.4">
                Dolci
              </NavDropdown.Item>
            </NavDropdown>
          
          </Nav>
          <Nav className="ms-auto">
          <Link to="/register" className={addActiveOrNot('register')}>
             Registrati
            </Link>
            <Link to="/login" className={addActiveOrNot('login')}>
             Login
            </Link>
            <Link to="/userprofile" className={addActiveOrNot('userprofile')}>
            <img src="/assets/user.png" alt="user"className='user_png' />
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default CustomNavbar