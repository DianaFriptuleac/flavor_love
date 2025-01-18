import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import localStorage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import authReducer from "../reducers/authReducer";
import { combineReducers } from "@reduxjs/toolkit";
import profileReducer from "../reducers/profileReducer";
import ricettaReducer from "../reducers/ricettaReducer";
import ricetteReducer from "../reducers/fetchRicetteReducer";
import { ricettaReducer as updateRicettaReducer } from "../reducers/updateRicettaReducer";
import ricettarioReducer from "../reducers/ricettarioReducer";
import searchedRicette from "../reducers/searchReducer";

const persistConfig = {
  key: "root",
  storage:localStorage,

  //encrypt per nascondere i dati sensibili
  transforms: [
    encryptTransform({
      secretKey: 'my-super-secret-key', // La chiave segreta
      onError: (error) => {
        console.error('Errore durante la crittografia:', error); 
      },
    }),
  ],
};


const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  ricetta: ricettaReducer,
  ricette: ricetteReducer,
  updateRicetta: updateRicettaReducer,
  ricettari: ricettarioReducer,
  searched: searchedRicette,
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

 const store = configureStore({
  reducer: persistedReducer,

  //funzione per togliere l'errore del browser
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      //evito avvisi x oggetti non sensibilizzati
      serializableCheck: false,
    });
  },
});

const persistedStore = persistStore(store);

export {store, persistedStore};
