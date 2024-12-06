import { NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const DropdownRicettePerCategorie = () => {
  const navigate = useNavigate();

  const categorie = ["antipasti", "primi", "secondi", "dolci"];

  const handleSelect = (categoria) => {
    navigate(`/ricette/categoria/${categoria}`);
  };

  return (
    <NavDropdown
      title="Ricette"
      id="collapsible-nav-dropdown"
      className="nav-dropdown"
    >
      <NavDropdown.Item href="/ricette">Tutte le Ricette</NavDropdown.Item>
      {categorie.map((categoria) => (
        <NavDropdown.Item
          key={categoria}
          onClick={() => handleSelect(categoria)}
        >
          {categoria}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};

export default DropdownRicettePerCategorie;
