export const CREA_RICETTA = "CREA_RICETTA";
export const ADD_INGREDIENTI = "ADD_INGREDIENTI";
export const ADD_IMG = "ADD_IMG";
export const REMOVE_INGREDIENTE = "REMOVE_INGREDIENTE";
export const REMOVE_IMAGE = "REMOVE_IMAGE";

//Creo una nuova ricetta
export const creaRicetta = (ricettaData) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    if (!token) throw new Error("Token mancante!");

 console.log("Token inviato" , token);  //cancella dopo

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
    } else {
      const errMessage = await resp.text();
      throw new Error(`Errore dal server: ${errMessage}`);
    }
  } catch (er) {
    console.log("errore nella creazione ricetta: ", er.message);
    throw er;
  }
};
// Aggiungo ingrediente alla ricetta
export const addIngrediente = (ingredienteData) => ({
  type: ADD_INGREDIENTI,
  payload: ingredienteData,
});

//cancello ingredinete
export const removeIngrediente = (index) => ({
    type: "REMOVE_INGREDIENTE",
    payload: index,
  }); 

//Aggiungo immagine alla ricetta
export const addImage = (ricettaId, file) => async (dispatch, getState) => {
    try {
      const { token } = getState().auth;
      if (!token) throw new Error("Token mancante!");
  
      const formData = new FormData();
      formData.append("file", file);
  
      const resp = await fetch(`http://localhost:3001/api/imgRicette/${ricettaId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (resp.ok) {
        const imgUrl = await resp.text();
        dispatch({
          type: ADD_IMG,
          payload: imgUrl,
        });
      } else {
        const errMessage = await resp.text();
        throw new Error(`Errore dal server: ${errMessage}`);
      }
    } catch (er) {
      console.error("Errore durante l'upload dell'immagine:", er.message);
      throw er;
    }
  };

  //rimuovo img
  export const removeImage = (index) => ({
    type: REMOVE_IMAGE,
    payload: index,
  });
