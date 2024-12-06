export const FETCH_RICETTE_SUCCESS = "FETCH_RICETTE_SUCCESS";
export const FETCH_RICETTE_ERROR = "FETCH_RICETTE_ERROR";
export const FETCH_DETTAGLI_RICETTA_PENDING = "FETCH_DETTAGLI_RICETTA_PENDING";
export const FETCH_DETTAGLI_RICETTA_SUCCESS = "FETCH_DETTAGLI_RICETTA_SUCCESS";
export const FETCH_DETTAGLI_RICETTA_ERROR = "FETCH_DETTAGLI_RICETTA_ERROR";
export const FETCH_RICETTE_UTENTE_SUCCESS = "FETCH_RICETTE_UTENTE_SUCCESS";
export const FETCH_SET_INGREDIENTI = "FETCH_SET_INGREDIENTI";
export const FETCH_IMAGES_SUCCESS_UPDATE = "FETCH_IMAGES_SUCCESS_UPDATE";

export const fetchRicette =
  (page = 0, size = 12) =>
  async (dispatch, getState) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Token mancante!");

      const response = await fetch(
        `http://localhost:3001/api/ricette?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("All ricette restituite:", data);
        dispatch({
          type: FETCH_RICETTE_SUCCESS,
          payload: {
            content: data.content,
            totalPages: data.totalPages,
            currentPage: page,
          },
        });
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Errore nel fetch delle ricette");
      }
    } catch (error) {
      console.error("Errore nel fetch delle ricette:", error.message);
      dispatch({ type: FETCH_RICETTE_ERROR, payload: error.message });
    }
  };

//fetch ricette dell'utente
export const fetchRicetteUtente = () => async (dispatch, getState) => {
  const { token, user } = getState().auth;

  if (!token || !user?.id) {
    console.error("Errore: ID utente non trovato nello stato Redux.");
    dispatch({
      type: FETCH_RICETTE_ERROR,
      payload: "ID utente non trovato.",
    });
    return;
  }

  const params = new URLSearchParams({
    size: 1000,
    page: 0,
    sortBy: "titolo",
  });

  try {
    const url = `http://localhost:3001/api/ricette/utente/${
      user.id
    }?${params.toString()}`;
    console.log("URL generato:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Ricette recuperate:", data.content);
      dispatch({
        type: FETCH_RICETTE_UTENTE_SUCCESS,
        payload: data.content || [],
      });
    } else {
      const errorText = await response.text();
      throw new Error(errorText || "Errore nel recupero delle ricette.");
    }
  } catch (err) {
    console.error("Errore fetch ricette:", err.message);
    dispatch({
      type: FETCH_RICETTE_ERROR,
      payload: err.message,
    });
  }
};

//dettagli ricetta

export const fetchDettagliRicetta = (id) => async (dispatch, getState) => {
  dispatch({ type: FETCH_DETTAGLI_RICETTA_PENDING }); // Stato iniziale di caricamento
  try {
    const { token } = getState().auth; // Recupero il token dal Redux store
    if (!token) throw new Error("Token mancante!");

    const response = await fetch(`http://localhost:3001/api/ricette/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log("COMPONENTI RICETTA", data);
      dispatch({ type: FETCH_DETTAGLI_RICETTA_SUCCESS, payload: data });
      dispatch({
        type: FETCH_SET_INGREDIENTI,
        payload: data.ingredienti || [],
      });
      dispatch({ type: FETCH_IMAGES_SUCCESS_UPDATE, payload: data.img || [] });
    } else {
      const errorText = await response.text();
      throw new Error(
        errorText || "Errore nel fetch dei dettagli della ricetta"
      );
    }
  } catch (error) {
    console.error("Errore fetch dettagli ricetta:", error.message);
    dispatch({ type: FETCH_DETTAGLI_RICETTA_ERROR, payload: error.message });
  }
};
