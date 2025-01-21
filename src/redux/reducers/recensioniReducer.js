import {
  ADD_RECENSIONE,
  REMOVE_RECENSIONE,
  SET_RECENSIONI,
  UPDATE_RECENSIONE,
} from "../actions/recensioniActions";

const initialState = {
    recensioniPerRicetta: {}, // Ogni ricetta avrà le sue recensioni
  };
  
  const recensioniReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_RECENSIONI:
        return {
          ...state,
          recensioniPerRicetta: {
            ...state.recensioniPerRicetta,
            [action.payload.ricettaId]: action.payload.recensioni || [],
          },
        };
  
      case ADD_RECENSIONE:
        return {
          ...state,
          recensioniPerRicetta: {
            ...state.recensioniPerRicetta,
            [action.payload.ricettaId]: [
              ...(state.recensioniPerRicetta[action.payload.ricettaId] || []),
              action.payload.recensione,
            ],
          },
        };
  
        case UPDATE_RECENSIONE: {
            const { ricettaId, recensione } = action.payload;
          
            // controllo che ci siano recensioni per il ricettaId
            const recensioniAttuali = state.recensioniPerRicetta[ricettaId] || [];
          
            // aggiorno solo la recensione selezionata
            return {
              ...state,
              recensioniPerRicetta: {
                ...state.recensioniPerRicetta,
                [ricettaId]: recensioniAttuali.map((rec) =>
                  rec.id === recensione.id
                    ? { ...rec, ...recensione } // sovrascrivo solo i campi aggiornati
                    : rec
                ),
              },
            };
          }
          
  
      case REMOVE_RECENSIONE:
        const { ricettaId, recensioneId } = action.payload;
        return {
          ...state,
          recensioniPerRicetta: {
            ...state.recensioniPerRicetta,
            [ricettaId]: state.recensioniPerRicetta[ricettaId].filter(
              (recensione) => recensione.id !== recensioneId
            ),
          },
        };
  
      default:
        return state;
    }
  };
  
  export default recensioniReducer;
  
