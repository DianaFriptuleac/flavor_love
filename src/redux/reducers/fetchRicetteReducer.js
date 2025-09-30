import {
  FETCH_RICETTE_SUCCESS,
  FETCH_RICETTE_ERROR,
  FETCH_DETTAGLI_RICETTA_PENDING,
  FETCH_DETTAGLI_RICETTA_SUCCESS,
  FETCH_DETTAGLI_RICETTA_ERROR,
  FETCH_RICETTE_UTENTE_SUCCESS,
  FETCH_SET_INGREDIENTI,
  FETCH_IMAGES_SUCCESS_UPDATE,
  FETCH_RICETTE_PENDING,
} from "../actions/fetchRicetteAction";
const initialState = {
  ricette: [],
  totalPages: 0,
  currentPage: 0,
  ricetteUtente: [],
  dettagli: null,
  error: null,
  loading: false,
};

const ricetteReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_RICETTE_PENDING:
      return {
        ...state,
        loading: true,
        error: null,
        ricette: [],
        currentPage: action.payload.page,
      };
    case FETCH_RICETTE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        ricette: action.payload.content,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.currentPage,
      };
    case FETCH_RICETTE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        ricette: [],
      };
    case FETCH_RICETTE_UTENTE_SUCCESS:
      return {
        ...state,
        ricetteUtente: action.payload,
      };
    case FETCH_DETTAGLI_RICETTA_PENDING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_DETTAGLI_RICETTA_SUCCESS:
      return {
        ...state,
        loading: false,
        dettagli: action.payload,
      };
    case FETCH_DETTAGLI_RICETTA_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case FETCH_SET_INGREDIENTI:
      // console.log("Payload ricevuto per gli ingredienti:", action.payload);
      return {
        ...state,
        ingredienti: Array.isArray(action.payload) ? action.payload : [],
      };
    case FETCH_IMAGES_SUCCESS_UPDATE:
      return {
        ...state,
        dettagli: {
          ...state.dettagli,
          img: action.payload,
        },
      };

    default:
      return state;
  }
};

export default ricetteReducer;
