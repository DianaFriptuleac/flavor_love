import {
  UPDATE_RICETTA_SUCCESS,
  UPDATE_RICETTA_ERROR,
  REMOVE_IMAGE_SUCCESS,
  FETCH_IMAGES_SUCCESS,
  FETCH_IMAGES_ERROR,
} from "../actions/updateRicettaActions";
const initialState = {
  dettagli: null,
  error: null,
  successMessage: null,
};

export const ricettaReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_RICETTA_SUCCESS:
      return {
        ...state,
        dettagli: action.payload,
        successMessage: "Ricetta aggiornata con successo!",
      };
    case FETCH_IMAGES_SUCCESS:
      return {
        ...state,
        dettagli: {
          ...state.dettagli,
          img: action.payload,
        },
      };
    case REMOVE_IMAGE_SUCCESS:
      console.log(
        "Immagini nello stato prima della rimozione:",
        state.dettagli.img
      );
      console.log("Payload ricevuto per la rimozione:", action.payload);

      return {
        ...state,
        dettagli: {
          ...state.dettagli,
          img: state.dettagli.img.filter((img) => img.id !== action.payload),
        },
      };

    case FETCH_IMAGES_ERROR:
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
