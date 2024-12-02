import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./components/Register";
import Login from "./components/Login";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import CustomNavbar from "./components/CustomNavbar";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import PrivateRouteUser from "./components/PrivateRouteUser";
import UserProfile from "./components/UserProfile";
import CreaRicetta from "./components/CreaRicetta";
import RicetteUtente from "./components/RicetteUtente";

function App() {
  return (
    <BrowserRouter>
      <header>
        <CustomNavbar />
      </header>
      <main>
      <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/userprofile" element ={<PrivateRouteUser> <UserProfile/> </PrivateRouteUser>} />
          <Route path="/" element={<Home/>}/>
          <Route path="/creaRicetta" element={<CreaRicetta/>}/>
          <Route path = "/ricetteUtente" element = {<RicetteUtente/>}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
