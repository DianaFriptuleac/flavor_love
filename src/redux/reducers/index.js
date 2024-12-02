import authReducer from "./authReducer";
import { combineReducers } from "@reduxjs/toolkit";
import profileReducer from "./profileReducer";
import ricettaReducer from "./ricettaReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    ricetta: ricettaReducer,
});

export default rootReducer;