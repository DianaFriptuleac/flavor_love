export const SET_RICETTARI = "SET_RICETTARI";
export const ADD_RICETTARIO = "ADD_RICETTARIO";
export const REMOVE_RICETTARIO = "REMOVE_RICETTARIO";
export const ADD_RICETTA_TO_RICETTARIO = "ADD_RICETTA_TO_RICETTARIO";

//elenco ricettari
export const setRicettari = (ricettari) => ({
  type: SET_RICETTARI,
  payload: ricettari,
});

//add ricettari
export const addRicettario = (ricettario) => ({
  type: ADD_RICETTARIO,
  payload: ricettario,
});

//add ricetta al ricettario
export const addRicettaToRicettario = (ricettarioId, ricettaId) => ({
  type: ADD_RICETTA_TO_RICETTARIO,
  payload: { ricettarioId, ricettaId },
});

//cancello ricettario
export const removeRicettario = (ricettarioId) => ({
  type: REMOVE_RICETTARIO,
  payload: ricettarioId,
});
