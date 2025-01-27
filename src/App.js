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
import DettagliRicetta from "./components/DettagliRicetta";
import ModificaRicetta from "./components/ModificaRicetta";
import Ricettario from "./components/Ricettario";
import AllRicette from "./components/AllRicette";
import SelectRicetteFromModal from "./components/SelectRicetteFromModal";
import DettagliRicettario from "./components/DettagliRicettario";
import RicettePerCategorie from "./components/RicettePerCategorie";
import Liked from "./components/Liked";
import SearchResults from "./components/SearchResults";
import DettagliRicetteEsterne from "./components/DettagliRicetteEsterne";
import ListaSpesa from "./components/ListaSpesa";
import MyFooter from "./components/MyFooter";
import Ristoranti from "./components/Ristoranti";


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
          <Route path="/ricette" element = {<AllRicette/>}/>
          <Route path="/ricette/:id" element={<DettagliRicetta />} />
          <Route path="/ricette/:id/update" element={<ModificaRicetta />} />
          <Route path="/ricettario" element={<Ricettario/>} />
          <Route path="ricetteRRicettario" element={<SelectRicetteFromModal/>}/>
          <Route path="/ricettari/:id" element={<DettagliRicettario/>}/>
          <Route path="/ricette/categoria/:categoria" element={<RicettePerCategorie />} />
          <Route path="/ricette/liked" element={<Liked/>}/>
          <Route path="ricette/search" element={<SearchResults/>}/>
          <Route path="/ricetteEsterne/:id" element={<DettagliRicetteEsterne/>}/>
          <Route path="/listaSpesa" element={<ListaSpesa/>}/>
          <Route path="/ristoranti" element= {<Ristoranti/>}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
     <footer>
      <MyFooter/>
     </footer>
    </BrowserRouter>
  );
}

export default App;
