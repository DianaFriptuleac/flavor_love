export const CREA_RICETTA = "CREA_RICETTA";
export const ADD_INGREDIENTI = "ADD_INGREDIENTI";
export const ADD_IMG = "ADD_IMG";
export const REMOVE_INGREDIENTE = "REMOVE_INGREDIENTE";
export const REMOVE_IMAGE = "REMOVE_IMAGE";
export const RESET_RICETTA = "RESET_RICETTA";
export const REMOVE_RICETTA = "REMOVE_RICETTA";
export const ADD_INGREDIENTI_ERROR = "ADD_INGREDIENTI_ERROR";
export const SET_INGREDIENTI = "SET_INGREDIENTI";

// Creo una ricetta e aggiungo l'img - se presente
export const creaRicettaConImmagine =
  (ricettaData, file) => async (dispatch, getState) => {
    try {
      //1.creo ricetta dispechando creaRicetta
      const newRicetta = await dispatch(creaRicetta(ricettaData));

      // 2.carico img- se presente dispechando addImg
      if (file && newRicetta.payload?.id) {
        await dispatch(addImage(newRicetta.payload.id, file));
      }

      console.log("Ricetta creata con successo:", newRicetta);
    } catch (error) {
      console.error(
        "Errore nella creazione della ricetta con immagine:",
        error.message
      );
      throw error;
    }
  };

// Creo una nuova ricetta
export const creaRicetta = (ricettaData) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth; //recupero il token
    if (!token) throw new Error("Token mancante!");

    const resp = await fetch("http://localhost:3001/api/ricette", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ricettaData),
    });

    if (resp.ok) {
      const newRicetta = await resp.json();
      dispatch({
        type: CREA_RICETTA,
        payload: newRicetta,
      });
      return { payload: newRicetta };
    } else {
      const errMessage = await resp.text();
      throw new Error(`Errore dal server: ${errMessage}`);
    }
  } catch (er) {
    console.log("Errore nella creazione ricetta: ", er.message);
    throw er;
  }
};

// Aggiungo img. alla ricetta
export const addImage = (ricettaId, file) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    if (!token) throw new Error("Token mancante!");

    const formData = new FormData(); //FormatData x il file img.
    formData.append("file", file);
    console.log("FormData contiene:", file);

    const resp = await fetch(
      `http://localhost:3001/api/imgRicette/${ricettaId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (resp.ok) {
      const imgRicetta = await resp.json();
      dispatch({
        type: ADD_IMG,
        payload: imgRicetta,
      });
    } else {
      const errMessage = await resp.text();
      throw new Error(`Errore durante il caricamento immagine: ${errMessage}`);
    }
  } catch (er) {
    console.error("Errore durante l'upload dell'immagine:", er.message);
    throw er;
  }
};

//remove img
export const removeImage = (ricettaId, imageId) => async (dispatch, getState) => {
  try{
    const { token } = getState().auth;
    if (!token) throw new Error("Token mancante!");

    if(!imageId) throw new Error ("ID immagine mancante!");

    const rsp = await fetch(
      `http://localhost:3001/api/imgRicette/${imageId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if(rsp.ok) {
      dispatch({
        type:REMOVE_IMAGE,
        payload: imageId, //rimuovo l'img dallo stato di redux
      });
    }
  } catch(error){
    console.error("Errore durante la cancelazione del'img ", error);
    throw error;
  }
}

// Aggiungo ingrediente alla ricetta
export const addIngredienti =
  (ricettaId, ingredienti) => async (dispatch, getState) => {
    try {
      const { token } = getState().auth;
      if (!ricettaId) throw new Error("ID ricetta non valido!");

      const response = await fetch(
        `http://localhost:3001/api/ricette/${ricettaId}/ingredienti`,
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
        const data = await response.json();
        console.log("Dati ricevuti dal backend:", data);

        const mappedData = data.ingredienti.map((ing) => ({
          id: ing.id,
          nome: ing.nome,
          dosaggio: ing.dosaggio,
          sezione: ing.sezione,
        }));
        console.log("Dati mappati per il reducer:", mappedData);

        dispatch({
          type: ADD_INGREDIENTI,
          payload: mappedData,
        });
      } else {
        const errorText = await response.text();
        throw new Error(`Errore: ${errorText}`);
      }
    } catch (error) {
      console.error(
        "Errore durante l'aggiunta degli ingredienti:",
        error.message
      );
      throw error;
    }
  };

//prendo ingredienti
export const fetchIngredienti = (ricettaId) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;

    if (!ricettaId) {
      throw new Error("ID ricetta non valido!");
    }

    const response = await fetch(
      `http://localhost:3001/api/ricette/${ricettaId}/ingredienti`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const ingredienti = Array.isArray(data.ingredienti)
        ? data.ingredienti
        : [];
      console.log("Ingredienti estratti:", ingredienti);
      dispatch({
        type: SET_INGREDIENTI,
        payload: ingredienti,
      });
    } else {
      throw new Error("Errore durante il recupero degli ingredienti");
    }
  } catch (error) {
    console.error(
      "Errore durante il recupero degli ingredienti:",
      error.message
    );
  }
};

// Cancello ingrediente
export const removeIngrediente =
  (ricettaId, ingredienteId) => async (dispatch, getState) => {
    try {
      if (!ingredienteId) throw new Error("Ingrediente ID mancante!");
      const { token } = getState().auth;

      const response = await fetch(
        `http://localhost:3001/api/ricette/${ricettaId}/ingredienti/${ingredienteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        dispatch({
          type: REMOVE_INGREDIENTE,
          payload: ingredienteId,
        });
      } else {
        const errorText = await response.text();
        throw new Error(`Errore dal server: ${errorText}`);
      }
    } catch (error) {
      console.error("Errore durante la cancellazione dell'ingrediente:", error);
      throw error;
    }
  };



export const removeRicetta = (index) => ({
  type: REMOVE_RICETTA,
  payload: index,
});

// Resetto lo stato della ricetta
export const resetRicetta = () => ({
  type: RESET_RICETTA,
});
