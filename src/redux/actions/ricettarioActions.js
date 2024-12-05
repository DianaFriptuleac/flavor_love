export const SET_RICETTARI = "SET_RICETTARI";
export const ADD_RICETTARIO = "ADD_RICETTARIO";
export const REMOVE_RICETTARIO = "REMOVE_RICETTARIO";

//elenco ricettari
export const setRicettari = (ricettari) => ({
    type:SET_RICETTARI,
    payload:ricettari,
});

//add ricettari
export const addRicettario = (ricettario) => ({
    type:ADD_RICETTARIO,
    payload: ricettario,
});

//cancello ricettario
export const removeRicettario = (ricettarioId) =>({
    type: REMOVE_RICETTARIO,
    payload:ricettarioId,
});
