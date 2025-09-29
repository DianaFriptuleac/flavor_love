import {
  SEARCHED_RICETTA,
  SEARCH_RICHIESTA,
  SEARCH_ERROR,
} from "../actions/searchActions";

const initialState = {
  searchResults: [],
  isLoading: false,
  error: null,
};

const searchedRicette = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_RICHIESTA:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case SEARCHED_RICETTA:
      //console.log("Payload ricevuto nel reducer:", action.payload);
      return {
        ...state,
        searchResults: action.payload,
        isLoading: false,
      };
    case SEARCH_ERROR:
      return {
        ...state,
        searchResults: [],
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default searchedRicette;
