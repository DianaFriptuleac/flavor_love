import { UPLOAD_AVATAR, DELETE_USER} from "../actions/profileActions";

const initialState = {
    token: null,
    user: {
        id: null,
        nome: "",
        cognome: "",
        email: "",
        //avatar predefinito
         avatar: "/assets/avatar_fragola.jpg",

    }
};

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPLOAD_AVATAR:
            return {
                ...state,
                user: {
                    ...state.user,
                    // aggiorno solo l'avatar
                    avatar: action.payload,
                }
            }

            case DELETE_USER:
                return initialState;

            default:
                return state;
    }
}

export default profileReducer;