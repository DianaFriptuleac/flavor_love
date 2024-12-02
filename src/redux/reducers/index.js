import authReducer from "./authReducer";
import { combineReducers } from "@reduxjs/toolkit";
import profileReducer from "./profileReducer";
import ricettaReducer from "./ricettaReducer";
import ricetteReducer from "./fetchRicetteReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    ricetta: ricettaReducer,
    ricette: ricetteReducer,
});

export default rootReducer;