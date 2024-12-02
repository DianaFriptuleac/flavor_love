
const initialState = {
    ricette: [],
    error: null,
  };
  
  const ricetteReducer = (state = initialState, action) => {
    switch (action.type) {
      case "FETCH_RICETTE_SUCCESS":
        return {
          ...state,
          ricette: action.payload,
        };
      case "FETCH_RICETTE_ERROR":
        return {
          ...state,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default ricetteReducer;
  