import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

//Proteggo la rotta che richiede autenticazione
const PrivateRouteUser = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRouteUser;
