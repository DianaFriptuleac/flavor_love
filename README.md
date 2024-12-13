# **Flavor Love**

Benvenuti in **Flavor Love**, un'applicazione dedicata agli amanti della cucina e delle ricette! Questo progetto nasce dalla passione per il buon cibo e dall’idea di creare uno spazio personale dove ogni utente possa esplorare, salvare e condividere le proprie ricette preferite. **Flavor Love** è il tuo compagno perfetto per organizzare le tue ispirazioni culinarie e semplificare la tua esperienza in cucina.

---

## Tecnologie Utilizzate

### Frontend:
- **React**: Per la gestione dell’interfaccia utente e componenti reattivi.
- **React Bootstrap**: Per uno stile moderno e responsivo.
- **Redux**: Per la gestione centralizzata dello stato dell'applicazione.
- **CSS**: Per personalizzazioni stilistiche aggiuntive.

### Backend:
- **Spring Boot**: Per l'implementazione di API RESTful e gestione della logica di business.
- **Spring Security**: Per l'autenticazione e l'autorizzazione.
- **Integrazione con Spoonacular API**: Per recuperare ricette esterne.

---

## Repository del Backend

Il codice del backend è disponibile qui: [capstone_flavor_love](https://github.com/DianaFriptuleac/capstone_flavor_love.git)

---

## Funzionalità

Ecco le principali funzionalità offerte dall'applicazione:

### Registrazione e Login
- Gli utenti possono registrarsi per creare il proprio account personale e accedere a tutte le funzionalità dell'applicazione.

### Esplorazione delle Ricette
- Visualizzazione delle ricette.
- Filtraggio delle ricette per categorie.
- Grazie all’integrazione con l'API di Spoonacular (fetch effettuata nel backend), si possono visualizzare ricette esterne sempre aggiornate.
- Possibilità di cercare le ricette per nome.

### Ricettari Personalizzati
- Creazione e gestione di ricettari personalizzati.
- Aggiunta delle ricette ai ricettari.

### Pagina dei Preferiti
- Salvataggio e gestione delle ricette nei preferiti.

### Lista Spesa
- Aggiunta degli ingredienti delle ricette alla lista spesa.
- Modifica delle quantità o eliminazione degli ingredienti in base alle esigenze.

### Gestione delle Ricette
- Creazione di una nuova ricetta.
- Modifica delle ricette personali (create dall'utente autenticato).
- Eliminazione delle ricette personali.

### Dettagli delle Ricette
- Visualizzazione di tutti i dettagli della ricetta, inclusi ingredienti, procedimento, tempo di preparazione e altro.

### Profilo Utente
- Modifica dei dati personali, inclusi nome, cognome e avatar.

---

## Come Iniziare

1. Clona la repository del backend e segui le istruzioni per avviare il server.
2. Configura il frontend installando le dipendenze:
   ```bash
   npm install

3. Avvia l’applicazione in modalità di sviluppo:
   ```bash
   npm start
4. Accedi all’app su http://localhost:3000. 

## Roadmap di Sviluppo
Flavor Love è un progetto in continua evoluzione.
Ecco alcune funzionalità future che vorrei implementare:
- *Commenti per le ricette:* Gli utenti potranno lasciare recensioni e suggerimenti.
- *Sezione Ristoranti:* Una nuova area per scoprire ristoranti e leggere recensioni.
- *Deploy dell’applicazione:* Pubblicazione su una piattaforma cloud per renderla accessibile ovunque.
