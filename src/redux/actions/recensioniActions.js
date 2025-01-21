export const SET_RECENSIONI = "SET_RECENSIONI";
export const ADD_RECENSIONE = "ADD_RECENSIONE";
export const UPDATE_RECENSIONE = "UPDATE_RECENSIONE";
export const REMOVE_RECENSIONE = "REMOVE_RECENSIONE";

//set di recensioni
export const setRecensioni = (ricettaId, recensioni) => ({
    type: SET_RECENSIONI,
    payload:{ricettaId, recensioni},
});

//add recensione
export const addRecensione = (ricettaId, recensione) => ({
    type: ADD_RECENSIONE,
    payload:{ricettaId, recensione},
});

//update recensione
export const updateRecensione = (ricettaId,recensione) =>({
    type: UPDATE_RECENSIONE,
    payload:{ricettaId, recensione},
});

//delete recensione
export const removeRecensione = (ricettaId, recensioneId)=>({
    type: REMOVE_RECENSIONE,
    payload: { ricettaId, recensioneId },
});