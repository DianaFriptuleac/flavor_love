import authReducer from "./authReducer";
import { combineReducers } from "@reduxjs/toolkit";
import profileReducer from "./profileReducer";
import ricettaReducer from "./ricettaReducer";
import ricetteReducer from "./fetchRicetteReducer";
import { ricettaReducer as updateRicettaReducer } from "./updateRicettaReducer";
import ricettarioReducer from "./ricettarioReducer";
import likedRicette from "./likedReducer";
import searchedRicette from "./searchReducer"; 

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  ricetta: ricettaReducer,
  ricette: ricetteReducer,
  updateRicetta: updateRicettaReducer,
  ricettari: ricettarioReducer,
  liked: likedRicette,
  searched: searchedRicette,
});

export default rootReducer;
