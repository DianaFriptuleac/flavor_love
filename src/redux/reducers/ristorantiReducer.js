import {
  ADD_RISTORANTI,
  REMOVE_RISTORANTI,
  SET_RISTORANTI,
  UPDATE_RISTORANTI,
  SEARCHED_RISTORANTE,
  SEARCH_RISTORANTE,
  SEARCH_RISTORANTE_ERROR,
} from "../actions/ristoranteAction";

const initialState = {
  ristoranti: [],
  searchRistoranti: [],
  isLoading: false,
  error: null,
};

const ristorantiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RISTORANTI:
      return {
        ...state,
        ristoranti: action.payload,
        searchRistoranti: null, //resetto i risultati di ricerca
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
    case SEARCH_RISTORANTE:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case SEARCHED_RISTORANTE:
      return {
        ...state,
        searchRistoranti: action.payload,
        isLoading: false,
      };

    case SEARCH_RISTORANTE_ERROR:
      return {
        ...state,
        searchRistoranti: [],
        isLoading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
export default ristorantiReducer;
