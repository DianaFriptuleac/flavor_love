import { LIKED_RICETTE } from "../actions/likedActions";

const initialState = {
  ricette: {}, //ggeto x mappare le ricette per utente
};

const likedRicette = (state = initialState, action) => {
  switch (action.type) {
    case LIKED_RICETTE: {
      const {ricetta, userId} = action.payload;
      const userLikedRicette = state.ricette[userId] || [];
      const exists = userLikedRicette.find((r) => r.id === ricetta.id);

      return {
        ...state,
        ricette: {
          ...state.ricette,
          [userId]: exists
            ? userLikedRicette.filter((r) => r.id !== ricetta.id)
            : [...userLikedRicette, ricetta],
        },
      };
    }
    default:
      return state;
  }
};

export default likedRicette;
