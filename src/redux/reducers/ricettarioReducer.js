import {
  SET_RICETTARI,
  ADD_RICETTARIO,
  REMOVE_RICETTARIO,
} from "../actions/ricettarioActions";

const initialState = {
  list: [],
};

export default function ricettarioReducer(state = initialState, action) {
  switch (action.type) {
    case SET_RICETTARI:
      console.log("SET_RICETTARI payload:", action.payload);
      return { ...state, list: action.payload };

    case ADD_RICETTARIO:
      if (!action.payload || typeof action.payload !== "object") {
        console.error(
          "Il payload di ADD_RICETTARIO non e un oggetto valido:",
          action.payload
        );
        return state;
      }
      return { ...state, list: [...state.list, action.payload] };

    case REMOVE_RICETTARIO:
      return {
        ...state,
        list: state.list.filter((r) => r.id !== action.payload),
      };

    default:
      return state;
  }
}
