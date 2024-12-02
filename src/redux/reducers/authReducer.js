import { REGISTER_USER, LOGIN_USER, LOGOUT_USER } from "../actions/authActions";

const initialState = {
    token: null,
    user: null,
    isAuthenticated: false,
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case REGISTER_USER:
        return {
          ...state,
          user: action.payload,
          isAuthenticated: true,
        }

        case LOGIN_USER:
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,
                isAuthenticated: true,
            }

            case LOGOUT_USER:
                return initialState;
                default:
                    return state;
    }
}

export default authReducer;