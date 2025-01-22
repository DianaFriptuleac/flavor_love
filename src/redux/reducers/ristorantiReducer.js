import {
  ADD_RISTORANTI,
  REMOVE_RISTORANTI,
  SET_RISTORANTI,
  UPDATE_RISTORANTI,
} from "../actions/ristoranteAction";

const initialState = {
  ristoranti: [],
};

const ristorantiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RISTORANTI:
      return {
        ...state,
        ristoranti: action.payload,
      };

    case ADD_RISTORANTI:
      return {
        ...state,
        ristoranti: [...state.ristoranti, action.payload],
      };

    case UPDATE_RISTORANTI:
      return {
        ...state,
        ristoranti: state.ristoranti.map((ristorante) =>
          ristorante.id === action.payload.id
            ? { ...ristorante, ...action.payload }
            : ristorante
        ),
      };

    case REMOVE_RISTORANTI:
      return {
        ...state,
        ristoranti: state.ristoranti.filter(
          (ristorante) => ristorante.id !== action.payload
        ),
      };

    default:
      return state;
  }
};
export default ristorantiReducer;
