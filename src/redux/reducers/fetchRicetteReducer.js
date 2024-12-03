import {FETCH_RICETTE_SUCCESS,
   FETCH_RICETTE_ERROR,
  FETCH_DETTAGLI_RICETTA_PENDING,
  FETCH_DETTAGLI_RICETTA_SUCCESS,
  FETCH_DETTAGLI_RICETTA_ERROR
} from "../actions/fetchRicetteAction";
const initialState = {
    ricette: [],
    dettagli:null,
    error: null,
    loading:false,
  };
  
  const ricetteReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_RICETTE_SUCCESS:
        return {
          ...state,
          ricette: action.payload,
        };
      case FETCH_RICETTE_ERROR:
        return {
          ...state,
          error: action.payload,
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
      default:
        return state;
    }
  };
  
  export default ricetteReducer;
  