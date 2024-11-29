export const UPLOAD_AVATAR = "UPLOAD_AVATAR";
export const DELETE_USER = 'DELETE_USER';

//avatar
export const uploadAvatar = (formData) => async (dispatch, getState) =>{
    try{
        const { token, user} = getState().auth;

        const resp = await fetch(`http://localhost:3001/utenti/me/avatar`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if(resp.ok){
            const data = await resp.text();
            dispatch({
                type: UPLOAD_AVATAR,
                payload: data,
            });
        } else {
            throw new Error('Errore nel carricamento dei dati!');
        }
    }catch(er){
        console.log(er.message);
    }
}

//delete me
export const deleteMe = () => async (dispatch, getState) =>{
    try{
        const { token} = getState().auth;

        const resp = await fetch(`http://localhost:3001/utenti/me`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if(resp.ok){
            dispatch({
                type: DELETE_USER,
            });
        } else {
            throw new Error('Errore durante eliminazione account!');
        }
    }catch(er){
        console.log(er.message);
    }
}


