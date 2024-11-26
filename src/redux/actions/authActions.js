
export const REGISTER_USER = 'REGISTER_USER';
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

// Registrazione
export const registerUser = (useData) => async (dispatch) => {
    try{
        const resp = await fetch('http://localhost:3001/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(useData),
        });

        if(resp.ok){
            const data = await resp.json();
            dispatch({
                type: REGISTER_USER,
                payload: data,
            });
        } else {
            throw new Error('Errore nella registrazione!');
        }
    } catch(er){
        console.log(er.message);
    }
}


// Login
export const loginUser = (userCredentials) => async (dispatch) => {
    try{
        const resp = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userCredentials),
        });

        if(resp.ok){
            const data = await resp.json();
            dispatch({
                type: LOGIN_USER,
                payload: data.token,
            });
        } else {
            throw new Error('Credenziali errate!');
        }
    } catch(er){
        console.log(er.message);
        throw er;
    }
}


//Logout
export const logoutUser = () => ({
    type: LOGOUT_USER,
});