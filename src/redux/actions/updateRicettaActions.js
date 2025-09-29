export const UPDATE_RICETTA_SUCCESS = "UPDATE_RICETTA_SUCCESS";
export const UPDATE_RICETTA_ERROR = "UPDATE_RICETTA_ERROR";
export const ADD_IMAGE_SUCCESS = "ADD_IMAGE_SUCCESS";
export const REMOVE_IMAGE_SUCCESS = "REMOVE_IMAGE_SUCCESS";
export const FETCH_IMAGES_SUCCESS = "FETCH_IMAGES_SUCCESS";
export const FETCH_IMAGES_ERROR = "FETCH_IMAGES_ERROR";
export const UPDATE_INGREDIENTE_SUCCESS = "UPDATE_INGREDIENTE_SUCCESS";
export const UPDATE_INGREDIENTE_ERROR = "UPDATE_INGREDIENTE_ERROR";
export const ADD_NEW_INGREDIENTE = "ADD_NEW_INGREDIENTE";
export const REMOVE_INGREDIENTE_UPDATE = "REMOVE_INGREDIENTE_UPDATE";
export const FETCH_INGREDIENTI_SUCCESS = "FETCH_INGREDIENTI_SUCCESS";
export const FETCH_INGREDIENTI_ERROR = "FETCH_INGREDIENTI_ERROR";


// up ricetta
export const updateRicetta = (id, data) => async (dispatch, getState) => {
  const token = getState().auth.token;
  try {
    const response = await fetch(`https://capstone-flavor-love-1.onrender.com/api/ricette/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || "Errore durante l'aggiornamento della ricetta"
      );
    }

    const result = await response.json();
    dispatch({
      type: UPDATE_RICETTA_SUCCESS,
      payload: result,
    });

    return { payload: result };
  } catch (error) {
    console.error(
      "Errore durante l'aggiornamento della ricetta:",
      error.message
    );
    dispatch({ type: UPDATE_RICETTA_ERROR, payload: error.message });

    return { error: error.message };
  }
};
//fatch ingredienti
export const fetchIngredientiByRicettaId = (ricettaId) => async (dispatch, getState) => {
 // console.log("Fetching ingredienti for ricettaId:", ricettaId);
  const { token } = getState().auth;

  try {
    if (!ricettaId) throw new Error("ID ricetta non valido!");

    const response = await fetch(
      `https://capstone-flavor-love-1.onrender.com/api/ricette/${ricettaId}/ingredienti`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      //console.log("Risposta del server:", data);

      const ingredienti = data; 
 // console.log("Ingredienti estratti:", ingredienti); 

      dispatch({
        type: FETCH_INGREDIENTI_SUCCESS,
        payload: ingredienti,
      });
     // console.log("!!!!Dati inviati al reducer:", ingredienti);
    } else {
      const errorText = await response.text();
      throw new Error(`Errore nel fetch degli ingredienti: ${errorText}`);
    }
  } catch (error) {
    console.error("Errore durante il fetch degli ingredienti:", error.message);
    dispatch({
      type: FETCH_INGREDIENTI_ERROR,
      payload: error.message,
    });
  }
};

//update di un ingrediente
export const updateIngrediente =
  (ricettaId, ingredienteId, updatedData) => async (dispatch, getState) => {
    const { token } = getState().auth;

    try {
      const response = await fetch(
        `https://capstone-flavor-love-1.onrender.com/api/ricette/${ricettaId}/ingredienti/${ingredienteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        dispatch({
          type: UPDATE_INGREDIENTE_SUCCESS,
          payload: data.ingredienti,
        });
        return data;
      } else {
        const errorText = await response.text();
        throw new Error(
          errorText || "Errore durante l'aggiornamento dell'ingrediente."
        );
      }
    } catch (error) {
      dispatch({
        type: UPDATE_INGREDIENTE_ERROR,
        payload: error.message,
      });
      console.error(
        "Errore durante l'aggiornamento dell'ingrediente:",
        error.message
      );
      throw error;
    }
  };
//aggiungo ingrediente
export const addIngredientiUp = (ricettaId, ingredienti) => async (dispatch, getState) => {
  const { token } = getState().auth;
  try {
    const response = await fetch(
      `https://capstone-flavor-love-1.onrender.com/api/ricette/${ricettaId}/ingredienti`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(ingredienti),
      }
    );

    if (response.ok) {
     // console.log('Ingrediente aggiunto correttamente');
      const data = await response.json();
      dispatch({
        type: ADD_NEW_INGREDIENTE,
        payload: data,
      });
    } else {
      const errorText = await response.text();
      throw new Error(`Errore: ${errorText}`);
    }
  } catch (error) {
    console.error("Errore durante l'aggiunta degli ingredienti:", error.message);
    throw error;
  }
};


//elimino ingrediente
export const removeIngredienteUp = (ricettaId, ingredienteId) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    if (!ingredienteId) throw new Error("Ingrediente ID mancante!");

    const response = await fetch(
      `https://capstone-flavor-love-1.onrender.com/api/ricette/${ricettaId}/ingredienti/${ingredienteId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      await dispatch(fetchIngredientiByRicettaId(ricettaId)); //  stato
    } else {
      const errorText = await response.text();
      throw new Error(`Errore dal server: ${errorText}`);
    }
  } catch (error) {
    console.error("Errore durante la cancellazione dell'ingrediente:", error.message);
    throw error;
  }
};


//recupero immagini
export const fetchImagesByRicettaId =
  (ricettaId) => async (dispatch, getState) => {
    const { token } = getState().auth;

    try {
      const response = await fetch(
        `https://capstone-flavor-love-1.onrender.com/api/imgRicette/ricetta/${ricettaId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
       // console.log("Immagini estratte dal backend:", data.content);
        dispatch({
          type: FETCH_IMAGES_SUCCESS,
          payload: data.content,
        });
      } else {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error) {
      dispatch({ type: FETCH_IMAGES_ERROR, payload: error.message });
      console.error("Errore nel recupero delle immagini:", error.message);
    }
  };

// Rimuovo un immagine
export const removeImage =
  (ricettaId, imageId) => async (dispatch, getState) => {
    const { token } = getState().auth;

    try {
      const response = await fetch(
        `https://capstone-flavor-love-1.onrender.com/api/imgRicette/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || "Errore durante la rimozione dell'immagine"
        );
      }

      console.log("Immagine rimossa con successo");
      dispatch({ type: REMOVE_IMAGE_SUCCESS, payload: imageId });
      dispatch(fetchImagesByRicettaId(ricettaId));
    } catch (error) {
      console.error(
        "Errore durante la rimozione dell'immagine:",
        error.message
      );
    }
  };

  //aggiungo img
  export const addUpdateImg = (ricettaId, file) => async (dispatch, getState) => {
    const token = getState().auth.token;
  
    try {
      const formData = new FormData();
      formData.append("file", file);
     // console.log("FormData pe IMG UPDATE contiene:", file);
  
      const response = await fetch(
        `https://capstone-flavor-love-1.onrender.com/api/imgRicette/${ricettaId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        dispatch({ type: ADD_IMAGE_SUCCESS, payload: data });
      } else {
        const errorText = await response.text();
        throw new Error(`Errore durante il caricamento: ${errorText}`);
      }
    } catch (err) {
      console.error("Errore durante l'aggiunta dell'immagine: ", err.message);
    }
  };
  
