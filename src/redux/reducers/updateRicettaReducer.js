import {
  UPDATE_RICETTA_SUCCESS,
  UPDATE_RICETTA_ERROR,
  ADD_IMAGE_SUCCESS,
  REMOVE_IMAGE_SUCCESS,
  FETCH_IMAGES_SUCCESS,
  FETCH_IMAGES_ERROR,
  UPDATE_INGREDIENTE_SUCCESS,
  ADD_NEW_INGREDIENTE,
  REMOVE_INGREDIENTE_UPDATE,
  FETCH_INGREDIENTI_SUCCESS,
  FETCH_INGREDIENTI_ERROR,
} from "../actions/updateRicettaActions";

// stato iniziale
const initialState = {
  ricetta: {
    ingredienti: [],
    img:[],
  },
  error: null,
  successMessage: null,
};

export const ricettaReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_RICETTA_SUCCESS:
      return {
        ...state,
        ricetta: action.payload,  //intera ricetta
        successMessage: "Ricetta aggiornata con successo!",
        error: null,
      };

    // Gestisco l'aggiornamento delle immagini
    case FETCH_IMAGES_SUCCESS:
     // console.log("IMG Reducer: Stato precedente:", state);
      //console.log("IMG Reducer: Aggiorno lo stato con:", action.payload);
      return {
        ...state,
        ricetta: {
          ...state.ricetta,
          img: Array.isArray(action.payload)? action.payload:[]
        },
      };


      case ADD_IMAGE_SUCCESS:
        return{
          ...state,
          ricetta:{
            ...state.ricetta,
            img: [...(state.ricetta.img || []), action.payload],

          }
        }

    case REMOVE_IMAGE_SUCCESS:
      return {
        ...state,
        ricetta: {
          ...state.ricetta,
          img: state.ricetta.img.filter((img) => img.id !== action.payload),
        },
      };

    case FETCH_IMAGES_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    // Gestisco l'aggiornamento degli ingredienti
    case ADD_NEW_INGREDIENTE:
  //console.log("Aggiungo nuovo ingrediente:", action.payload); // Debug log
  return {
    ...state,
    ricetta: {
      ...state.ricetta,
      ingredienti: Array.isArray(action.payload)
        ? [...state.ricetta.ingredienti, ...action.payload]
        : [...state.ricetta.ingredienti, action.payload],
    },
  };

      

    case REMOVE_INGREDIENTE_UPDATE:
      return {
        ...state,
        ricetta: {
          ...state.ricetta,
          ingredienti: state.ricetta.ingredienti.filter(
            (ingrediente) => ingrediente.id !== action.payload
          ),
        },
      };
      case UPDATE_INGREDIENTE_SUCCESS:
        const ingredientiAggiornati = state.ricetta.ingredienti.map((ingrediente) =>
          ingrediente.id === action.payload.id ? action.payload : ingrediente
        );
        return {
          ...state,
          ricetta: {
            ...state.ricetta,
            ingredienti: ingredientiAggiornati,
          },
        };

    // Gestisco il recupero degli ingredienti
    case FETCH_INGREDIENTI_SUCCESS:
      //console.log("REDUCER: Stato precedente:", state);
      //console.log("Reducer: Aggiorno lo stato con:", action.payload);
      return {
        ...state,
        ingredienti: Array.isArray(action.payload) ? action.payload : [],
      };
    

    case FETCH_INGREDIENTI_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_RICETTA_ERROR:
      return { ...state, error: action.payload };

    default:
      return state;
  }
};
