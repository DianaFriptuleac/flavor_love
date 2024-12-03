export const FETCH_RICETTE_SUCCESS = "FETCH_RICETTE_SUCCESS";
export const FETCH_RICETTE_ERROR = "FETCH_RICETTE_ERROR";

export const fetchRicette = () => async (dispatch, getState) => {
  try {
    const { token } = getState().auth; 
    if (!token) throw new Error("Token mancante!");

    const response = await fetch("http://localhost:3001/api/ricette", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      dispatch({ type: FETCH_RICETTE_SUCCESS, payload: data.content });
    } else {
      const errorText = await response.text();
      throw new Error(errorText || "Errore nel fetch delle ricette");
    }
  } catch (error) {
    console.error("Errore nel fetch delle ricette:", error.message);
    dispatch({ type: FETCH_RICETTE_ERROR, payload: error.message });
  }
};

//fetch per le ricette dell'utente
export const fetchRicetteUtente = () => async (dispatch, getState) => {
  const { token } = getState().auth;
  const { userId: utenteId } = getState().auth;

  try {
    const response = await fetch(`http://localhost:3001/api/ricette?utenteId=${utenteId}&size=1000`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      dispatch({
        type: "FETCH_RICETTE_SUCCESS",
        payload: data.content,
      });
    } else {
      throw new Error("Errore nel recupero delle ricette.");
    }
  } catch (err) {
    console.error("Errore fetch ricette:", err.message);
    dispatch({
      type: "FETCH_RICETTE_ERROR",
      payload: err.message,
    });
  }
};
