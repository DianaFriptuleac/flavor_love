import { REGISTER_USER, LOGIN_USER, LOGOUT_USER } from "../actions/authActions";

const initialState = {
    token: null,
    user: null,
}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case REGISTER_USER:
        return {
          ...state,
          user: action.payload,
        }

        case LOGIN_USER:
            return {
                ...state,
                token: action.payload,
            }

            case LOGOUT_USER:
                return initialState;
                default:
                    return state;
    }
}

export default authReducer;