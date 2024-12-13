export const SEARCH_RICHIESTA = "SEARCH_RICHIESTA";
export const SEARCHED_RICETTA = "SEARCHED_RICETTA";
export const SEARCH_ERROR = "SEARCH_ERROR";

export const searchedRichiesta = () => ({
  type: SEARCH_RICHIESTA,
});

export const searchedRicetta = (results) => ({
  type: SEARCHED_RICETTA,
  payload: results,
});

export const searchError = (error) => ({
  type: SEARCH_ERROR,
  payload: error,
});
