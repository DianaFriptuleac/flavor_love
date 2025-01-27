export const SET_RISTORANTI = "SET_RISTORANTI";
export const ADD_RISTORANTI = "ADD_RISTORANTI";
export const UPDATE_RISTORANTI = "UPDATE_RISTORANTI";
export const REMOVE_RISTORANTI = "REMOVE_RISTORANTI";
export const SEARCH_RISTORANTE = "SEARCH_RISTORANTE";
export const SEARCHED_RISTORANTE = "SEARCHED_RISTORANTE";
export const SEARCH_RISTORANTE_ERROR = "SEARCH_RISTORANTE_ERROR";

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

//cerca ristorante
export const cercaRistoranteAction = () => ({
  type: SEARCH_RISTORANTE,
});

export const searchedRistoranteAction = (results) => ({
  type: SEARCHED_RISTORANTE,
  payload: results,
});

export const searchRistoranteErrorAction = (error) => ({
  type: SEARCH_RISTORANTE_ERROR,
  payload: error,
});
