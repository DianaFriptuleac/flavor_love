import {
  UPLOAD_AVATAR,
  DELETE_USER,
  UPDATE_PROFILE,
  FETCH_USER_PROFILE,
} from "../actions/profileActions";

const initialState = {
  user: {
    id: null,
    nome: "",
    cognome: "",
    email: "",
    avatar: "",
  },
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_AVATAR:
      return {
        ...state,
        user: {
          ...state.user,
          avatar: action.payload,
        },
      };

    case UPDATE_PROFILE:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };

    case DELETE_USER:
      return initialState;

    case FETCH_USER_PROFILE:
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
};

export default profileReducer;
