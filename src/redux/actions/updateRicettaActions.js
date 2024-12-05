export const UPDATE_RICETTA_SUCCESS = "UPDATE_RICETTA_SUCCESS";
export const UPDATE_RICETTA_ERROR = "UPDATE_RICETTA_ERROR";
export const ADD_INGREDIENTE_SUCCESS = "ADD_INGREDIENTE_SUCCESS";
export const REMOVE_INGREDIENTE_SUCCESS = "REMOVE_INGREDIENTE_SUCCESS";
export const ADD_IMAGE_SUCCESS = "ADD_IMAGE_SUCCESS";
export const REMOVE_IMAGE_SUCCESS = "REMOVE_IMAGE_SUCCESS";
export const FETCH_IMAGES_SUCCESS = "FETCH_IMAGES_SUCCESS";
export const FETCH_IMAGES_ERROR = "FETCH_IMAGES_ERROR";

// Aggiorno una ricetta
export const updateRicetta = (id, data) => async (dispatch, getState) => {
  const token = getState().auth.token;
  try {
    const response = await fetch(`http://localhost:3001/api/ricette/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Errore durante l'aggiornamento della ricetta");
    }

    const result = await response.json();
    dispatch({
      type: "UPDATE_RICETTA_SUCCESS",
      payload: result, // La risposta del server
    });

    return { payload: result }; // Assicura che ritorni un oggetto con payload
  } catch (error) {
    console.error("Errore durante l'aggiornamento della ricetta:", error.message);
    dispatch({ type: "UPDATE_RICETTA_ERROR", payload: error.message });

    return { error: error.message }; // Ritorna un oggetto con un errore
  }
};


// Aggiungo un ingrediente
export const addIngrediente = (ricettaId, newIngrediente) => async (dispatch, getState) => {
  const { token } = getState().auth;

  try {
    const response = await fetch(
      `http://localhost:3001/api/ricette/${ricettaId}/ingredienti`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newIngrediente),
      }
    );

    if (response.ok) {
      const data = await response.json();
      dispatch({ type: ADD_INGREDIENTE_SUCCESS, payload: data });
    } else {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error("Errore aggiunta ingrediente:", error.message);
  }
};

//update di un ingrediente
export const updateIngrediente = (ricettaId, ingredienteId, updatedData) => async (dispatch, getState) => {
    const { token } = getState().auth;
  
    try {
      const response = await fetch(
        `http://localhost:3001/api/ricette/${ricettaId}/ingredienti/${ingredienteId}`,
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
          type: "UPDATE_INGREDIENTE_SUCCESS",
          payload: data,
        });
        return data;
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Errore durante l'aggiornamento dell'ingrediente.");
      }
    } catch (error) {
      dispatch({
        type: "UPDATE_INGREDIENTE_ERROR",
        payload: error.message,
      });
      console.error("Errore durante l'aggiornamento dell'ingrediente:", error.message);
      throw error;
    }
  };
  
// Rimuovo un ingrediente
export const removeIngrediente = (ricettaId, ingredienteId) => async (dispatch, getState) => {
  const { token } = getState().auth;

  try {
    const response = await fetch(
      `http://localhost:3001/api/ricette/${ricettaId}/ingredienti/${ingredienteId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      dispatch({ type: REMOVE_INGREDIENTE_SUCCESS, payload: ingredienteId });
    } else {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error("Errore rimozione ingrediente:", error.message);
  }
};

//recupero immagini
export const fetchImagesByRicettaId = (ricettaId) => async (dispatch, getState) => {
  const { token } = getState().auth;

  try {
    const response = await fetch(`http://localhost:3001/api/imgRicette/ricetta/${ricettaId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
/*
    if (response.ok) {
      const data = await response.json();
      if (data.content && data.content.length > 0) {
        dispatch({ type: FETCH_IMAGES_SUCCESS, payload: data.content });
      } else {
        dispatch({ type: FETCH_IMAGES_SUCCESS, payload: [] }); // Nessuna immagine trovata
      }
      return data.content; // Restituisce le immagini o un array vuoto
    */
      if (response.ok) {
        const data = await response.json();
        console.log("Immagini estratte dal backend:", data);
        dispatch({
          type: FETCH_IMAGES_SUCCESS,
          payload: data, 
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
// Aggiungo un immagine
export const addImage = (ricettaId, imageFile) => async (dispatch, getState) => {
  const { token } = getState().auth;

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch(`http://localhost:3001/api/ricette/${ricettaId}/images`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      dispatch({ type: ADD_IMAGE_SUCCESS, payload: data });
    } else {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error("Errore aggiunta immagine:", error.message);
  }
};

// Rimuovo un immagine
export const removeImage = (ricettaId, imageId) => async (dispatch, getState) => {
  const { token } = getState().auth;

  try {
    const response = await fetch(
      `http://localhost:3001/api/ricette/${ricettaId}/images/${imageId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      dispatch({ type: REMOVE_IMAGE_SUCCESS, payload: imageId });
    } else {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error("Errore rimozione immagine:", error.message);
  }
};
