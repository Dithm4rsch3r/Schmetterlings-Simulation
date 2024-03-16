
//Init-funktion aufrufen, wenn der Inhalt geladen ist
document.addEventListener('DOMContentLoaded', init, false);
//Es wird überprüft, ob die Seite online oder offline läuft im offline-Fall der Inhalt des 
//HTML-Elements mit der Klasse page-status überschrieben
function init() {
  if (!navigator.onLine) {
    const statusElem = document.querySelector('.page-status')
    statusElem.innerHTML = 'offline'
  }
}