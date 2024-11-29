import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";


//Proteggo la rotta che richiede autenticazione
const PrivateRouteUser = ({child}) => {
    const token = useSelector((state) => state.token);
    return token ? child : <Navigate to ="/ligin" />
}

export default PrivateRouteUser;