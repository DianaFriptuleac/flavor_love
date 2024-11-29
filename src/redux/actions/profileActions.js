export const UPLOAD_AVATAR = "UPLOAD_AVATAR";
export const DELETE_USER = "DELETE_USER";

//avatar
export const uploadAvatar = (formData) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    if (!token) throw new Error("Token mancante!");
    if (!formData.entries || typeof formData.entries !== "function") {
      console.error("formData.entries non è una funzione");
      return;
    }

    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    const resp = await fetch(`http://localhost:3001/utenti/me/avatar`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (resp.ok) {
      const data = await resp.json();
      console.log("Avatar aggiornato!", data);
      dispatch({
        type: UPLOAD_AVATAR,
        payload: data.avatarUrl,
      });
    } else {
      const errorMessage = await resp.text();
      throw new Error(`Errore dal server: ${errorMessage}`);
    }
  } catch (er) {
    console.error("Errore nell'azione uploadAvatar:", er.message);
  }
};

//delete me
export const deleteMe = () => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;

    const resp = await fetch(`http://localhost:3001/utenti/me`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (resp.ok) {
      dispatch({
        type: DELETE_USER,
      });
    } else {
      throw new Error("Errore durante eliminazione account!");
    }
  } catch (er) {
    console.log(er.message);
  }
};
