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

// Creo una nuova ricetta - chiamata Post API
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

// Aggiungo img. alla ricetta con chiamata Post -API
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
      const imgUrl = await resp.text();
      dispatch({
        type: ADD_IMG,
        payload: imgUrl,
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

        /*  const mappedData = data.map((ing) => ({
          id: ing.id || null,
          nome: ing.nome || "Nome non disponibile",
          dosaggio: ing.dosaggio || "Dosaggio non disponibile",
        }));
*/ 
const mappedData = Array.isArray(data) ? data : [data];
        console.log("Dati mappati per il reducer:", mappedData);

        dispatch({
          type: ADD_INGREDIENTI,
          payload: [...mappedData],
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

//prendo gli ingredienti
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
      const ingredienti = data.ingredienti || [];
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

/*fetch("http://localhost:3001/api/ricette/5d24bff8-204e-4564-9d54-024c109b4f4a/ingredienti", {
  method: "GET",
  headers: {
    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MzMxOTc5MDMsImV4cCI6MTczMzgwMjcwMywic3ViIjoiMmU1OTliOWUtM2M1NC00ZWQ5LWE0ZjctOTY2NjExYzZmNzA3IiwicnVvbG8iOiJBRE1JTiJ9.gK2mESDY29Wr2oxVpqq6Y9OeSdx1L1BOoZBeqLlPNMk",
  },
})
  .then((res) => res.json())
  .then((data) => console.log("Ingredienti dal backend:", data))
  .catch((err) => console.error("Errore:", err.message));
*/

// Cancello ingrediente
export const removeIngrediente = (index) => ({
  type: REMOVE_INGREDIENTE,
  payload: index,
});

// Rimuovo immagine
export const removeImage = (index) => ({
  type: REMOVE_IMAGE,
  payload: index,
});
export const removeRicetta = (index) => ({
  type: REMOVE_RICETTA,
  payload: index,
});

// Resetto lo stato della ricetta
export const resetRicetta = () => ({
  type: RESET_RICETTA,
});
