export const SEARCHED_RICETTA = "SEARCHED_RICETTA";

export const searchedRicetta = (results) => ({
    type:SEARCHED_RICETTA,
    payload:results,
});
