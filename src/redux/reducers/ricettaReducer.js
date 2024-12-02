import {
  CREA_RICETTA,
  ADD_INGREDIENTI,
  ADD_IMG,
  REMOVE_INGREDIENTE,
 REMOVE_IMAGE
} from "../actions/creaRicetta";

const initialState = {
  ricetta: null,
  ingredienti: [],
  image: [],
};

const ricettaReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREA_RICETTA:
      return {
        ...state,
        ricetta: action.payload,
      };

    case ADD_INGREDIENTI:
      return {
        ...state,
        ingredienti: [...state.ingredienti, action.payload],
      };
    case REMOVE_INGREDIENTE:
      return {
        ...state,
        ingredienti: state.ingredienti.filter((_, i) => i !== action.payload),
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
    default:
      return state;
  }
};
export default ricettaReducer;
