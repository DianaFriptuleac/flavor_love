import { UPLOAD_AVATAR, DELETE_USER} from "../actions/profileActions";

const initialState = {
    token: null,
    user: null,
};

const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPLOAD_AVATAR:
            return {
                ...state,
                user: {
                    ...state.user,
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