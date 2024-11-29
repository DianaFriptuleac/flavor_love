import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom";


//Proteggo la rotta che richiede autenticazione
const PrivateRouteUser = ({children}) => {
    const token = useSelector((state) => state.token);
    return token ? children : <Navigate to ="/login" />
}

export default PrivateRouteUser;