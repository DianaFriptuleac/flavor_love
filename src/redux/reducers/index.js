import authReducer from "./authReducer";
import { combineReducers } from "@reduxjs/toolkit";
import profileReducer from "./profileReducer";

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
});

export default rootReducer;