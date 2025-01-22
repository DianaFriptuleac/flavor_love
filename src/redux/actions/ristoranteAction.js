export const SET_RISTORANTI = "SET_RISTORANTI";
export const ADD_RISTORANTI = "ADD_RISTORANTI";
export const UPDATE_RISTORANTI = "UPDATE_RISTORANTI";
export const REMOVE_RISTORANTI = "REMOVE_RISTORANTI";

//set ristoranti
export const setRistorantiAction = (ristoranti) => ({
    type: SET_RISTORANTI,
    payload:ristoranti,
});

//add ristorante
export const addRistoranteAction = (ristorante) => ({
    type:ADD_RISTORANTI,
    payload:ristorante,
});

export const updateRistoranteAction = (ristoranteId) => ({
    type:UPDATE_RISTORANTI,
    payload:ristoranteId,
});

//delete ristorante
export const removeRistoranteAction = (ristoranteId) => ({
    type:REMOVE_RISTORANTI,
    payload:ristoranteId,
});

