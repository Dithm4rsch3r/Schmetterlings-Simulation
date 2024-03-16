//Init-funktion aufrufen, wenn der Inhalt geladen ist
document.addEventListener('DOMContentLoaded', init, false)

//Funktion registriert den Service worker und sagt returned Hash/Directory oder einen Fehler 
function init() {
  if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then((reg) => {
          console.log('Service worker registered -->', reg);
        }, (err) => {
          console.error('Service worker not registered -->', err);
        });
    }
  }