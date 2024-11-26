import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./components/Register";
import Login from "./components/Login";
import { BrowserRouter,Routes, Route } from "react-router-dom";
import CustomNavbar from "./components/CustomNavbar";
import NotFound from "./components/NotFound";

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
     
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
