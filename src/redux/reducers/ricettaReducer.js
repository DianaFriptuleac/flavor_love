import {
  CREA_RICETTA,
  ADD_INGREDIENTI,
  ADD_IMG,
  REMOVE_INGREDIENTE,
  REMOVE_IMAGE,
  RESET_RICETTA,
  REMOVE_RICETTA,
  ADD_INGREDIENTI_ERROR,
  SET_INGREDIENTI,
} from "../actions/creaRicetta";

const initialState = {
  ricetta: null,
  ingredienti: [],
  image: [],
  ricette: [],
};

const ricettaReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREA_RICETTA:
      return {
        ...state,
        ricetta: action.payload,
      };
      case ADD_INGREDIENTI:
        const ingredientiUnici = [
          ...state.ingredienti,
          ...action.payload.filter(
            (newIng) => !state.ingredienti.some((ing) => ing.id === newIng.id)
          ),
        ];
        console.log("Reducer: Ingredienti unici aggiunti:", ingredientiUnici);
        return {
          ...state,
          ingredienti: ingredientiUnici,
        };
      
      

    case ADD_INGREDIENTI_ERROR:
      return {
        ...state,
        error: action.payload,
      };
      case SET_INGREDIENTI:
        console.log("Payload ricevuto per gli ingredienti:", action.payload); 
        return {
          ...state,
          ingredienti: Array.isArray(action.payload) ? action.payload : [],
        };
      
        case REMOVE_INGREDIENTE:
          return {
            ...state,
            ingredienti: state.ingredienti.filter((ingrediente, i) => ingrediente.id !== action.payload),
          };
        
    case ADD_IMG:
      return {
        ...state,
        image: [...state.image, action.payload],
      };
    case REMOVE_IMAGE:
      return {
        ...state,
        image: state.image.filter((_, i) => i !== action.payload),
      };
    case RESET_RICETTA:
      return {
        ...initialState,
      };
    case REMOVE_RICETTA:
      return {
        ...state,
        ricette: state.ricette.filter(
          (ricetta) => ricetta.id !== action.payload
        ),
      };

    default:
      return state;
  }
};
export default ricettaReducer;
