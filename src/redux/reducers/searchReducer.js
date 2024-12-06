import { SEARCHED_RICETTA } from "../actions/searchActions";

const initialState = {
    searchResults: [],
    
  };
  
  const searchedRicette = (state = initialState, action) => {
    switch (action.type) {
      case SEARCHED_RICETTA:
        console.log("Payload ricevuto nel reducer:", action.payload); 
        return {
          ...state,
          searchResults: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default searchedRicette;
  