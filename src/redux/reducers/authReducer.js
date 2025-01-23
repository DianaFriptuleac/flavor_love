import { REGISTER_USER, LOGIN_USER, LOGOUT_USER } from "../actions/authActions";
//funzione pura -> a parita di un input restituisce sempre lo stesso output
const initialState = {
  userId: null,
  token: null,
  user: null,
  isAuthenticated: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };

    case LOGIN_USER:
      return {
        ...state,
        userId: action.payload.user.id,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
      };

    case LOGOUT_USER:
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
