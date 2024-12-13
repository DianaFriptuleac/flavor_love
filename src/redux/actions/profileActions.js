export const UPLOAD_AVATAR = "UPLOAD_AVATAR";
export const DELETE_USER = "DELETE_USER";
export const UPDATE_PROFILE = "UPDATE_PROFILE";

//avatar
export const uploadAvatar = (formData) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    if (!token) throw new Error("Token mancante!");

    const resp = await fetch("http://localhost:3001/utenti/me/avatar", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (resp.ok) {
      const data = await resp.json();
      console.log("Avatar aggiornato:", data);
      dispatch({
        type: UPLOAD_AVATAR,
        payload: data.avatarUrl,
      });
    } else {
      const errorMessage = await resp.text();
      throw new Error(`Errore dal server: ${errorMessage}`);
    }
  } catch (error) {
    console.error("Errore durante il caricamento dell'avatar:", error.message);
  }
};

//update me
export const updateProfile = (profileData) => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    if (!token) throw new Error("Token mancante!");

    const resp = await fetch("http://localhost:3001/utenti/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (resp.ok) {
      const updatedUser = await resp.json();
      console.log("Profilo aggiornato:", updatedUser);
      dispatch({
        type: UPDATE_PROFILE,
        payload: updatedUser,
      });
    } else {
      const errorMessage = await resp.text();
      throw new Error(`Errore dal server: ${errorMessage}`);
    }
  } catch (error) {
    console.error("Errore durante l'aggiornamento del profilo:", error.message);
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

//reccupero i dati aggiornati dal DB
export const FETCH_USER_PROFILE = "FETCH_USER_PROFILE";

export const fetchUserProfile = () => async (dispatch, getState) => {
  try {
    const { token } = getState().auth;
    if (!token) throw new Error("Token mancante!");

    const resp = await fetch("http://localhost:3001/utenti/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (resp.ok) {
      const user = await resp.json();
      dispatch({
        type: FETCH_USER_PROFILE,
        payload: user,
      });
    } else {
      const errorMessage = await resp.text();
      throw new Error(`Errore dal server: ${errorMessage}`);
    }
  } catch (error) {
    console.error("Errore durante il recupero del profilo:", error.message);
  }
};
