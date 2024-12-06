import { LIKED_RICETTE } from "../actions/likedActions";

const initialState = {
  ricette: [],
};

const likedRicette = (state = initialState, action) => {
  switch (action.type) {
    case LIKED_RICETTE: {
      const ricette = Array.isArray(state.ricette) ? state.ricette : [];
      const exists = ricette.find((r) => r.id === action.payload.id);

      return {
        ...state,
        ricette: exists
          ? ricette.filter((r) => r.id !== action.payload.id)
          : [...ricette, action.payload],
      };
    }
    default:
      return state;
  }
};

export default likedRicette;
