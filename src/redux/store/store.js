import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import rootReducer from "../reducers/index";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

  //funzione per togliere l'errore del browser
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      //evito avvisi x oggetti non sensibilizzati
      serializableCheck: false,
    });
  },
});

export const persistor = persistStore(store);
