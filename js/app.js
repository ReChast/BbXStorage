function mainmenu() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="menu">
      <button onclick="openpezzi()">Pezzi</button>
      <button onclick="opencombo()">Combo</button>
      <button onclick="openRegistroEventi()">Registro Eventi</button>
      
      <hr style="width:100%; border:0; border-top:1px solid #333; margin:15px 0;">
      
      <button onclick="downloadBackup()" class="secondary">💾 Scarica Backup</button>
      <button onclick="uploadBackup()" class="secondary">📂 Carica Backup</button>
    </div>

    <div class="icon-bar">
      
      <div class="social-item">
        <a href="https://www.instagram.com/tps_bbx" target="_blank" class="icon-link">
          <img src="assets/iglink.jpeg" alt="IG">
        </a>
        <span>Instagram</span>
      </div>

      <div class="social-item">
        <a href="https://t.me/+kGy7DQaqUVRlZjI0" target="_blank" class="icon-link">
          <img src="assets/tglink.jpeg" alt="TG">
        </a>
        <span>Telegram</span>
      </div>

    </div>
  `;
}


/* ====== SISTEMA DI BACKUP ====== */

function downloadBackup() {
  // 1. Prende TUTTI i dati presenti nel LocalStorage
  const dati = JSON.stringify(localStorage);
  
  // 2. Crea un file invisibile e lo scarica
  const blob = new Blob([dati], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  
  // Nome del file con la data di oggi
  const dataOggi = new Date().toISOString().slice(0, 10);
  a.download = `backup_bbx_${dataOggi}.json`;
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  alert("Backup scaricato! Salvalo al sicuro.");
}

function uploadBackup() {
  // Crea un input file invisibile per selezionare il json
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      try {
        // 1. Legge il file
        const datiSalvati = JSON.parse(event.target.result);
        
        // 2. Controlla se sembra un backup valido (opzionale)
        if (!datiSalvati) throw new Error("File vuoto");

        // 3. Pulisce il localStorage attuale e mette quello nuovo
        // ATTENZIONE: Questo sovrascrive tutto!
        localStorage.clear();
        
        Object.keys(datiSalvati).forEach(key => {
          localStorage.setItem(key, datiSalvati[key]);
        });

        alert("Backup ripristinato con successo!");
        location.reload(); // Ricarica la pagina per vedere le modifiche

      } catch (err) {
        alert("Errore nel file di backup. Sei sicuro sia quello giusto?");
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  input.click();
}


mainmenu();

/* ====== GESTIONE AUDIO ====== */

// 1. Configurazione Iniziale
const bgMusic = document.getElementById("bg-music");
const sfxClick = document.getElementById("sfx-click");
const muteBtn = document.getElementById("mute-btn");

// Volume (opzionale: abbassa la musica per sentire meglio i click)
bgMusic.volume = 0.2; 
sfxClick.volume = 1.0;

// Leggiamo lo stato salvato (Se non c'è, parte muto per evitare blocchi browser)
let isMuted = localStorage.getItem("audioMuted") === "true"; 
// Oppure metti 'false' se vuoi che parta attivo (ma il browser potrebbe bloccarlo)

updateMuteIcon();

// 2. Funzione per attivare/disattivare
function toggleAudio() {
  isMuted = !isMuted;
  localStorage.setItem("audioMuted", isMuted);
  
  updateMuteIcon();
  
  if (!isMuted) {
    // Se riattiviamo l'audio, proviamo a far partire la musica
    playMusic();
  } else {
    bgMusic.pause();
  }
}

// 3. Aggiorna l'icona
function updateMuteIcon() {
  if (isMuted) {
    muteBtn.innerText = "🔇";
    muteBtn.classList.remove("active");
    bgMusic.pause();
  } else {
    muteBtn.innerText = "🔊";
    muteBtn.classList.add("active");
    // Nota: La musica partirà al primo click utente se bloccata
  }
}

// 4. Funzione sicura per far partire la musica
function playMusic() {
  if (isMuted) return;
  
  // I browser richiedono una "promessa" per suonare
  bgMusic.play().catch(error => {
    console.log("Autoplay bloccato dal browser: serve un click dell'utente.");
  });
}

/* ... codice precedente (mute, variabili, ecc) ... */

// 5. GLOBAL CLICK LISTENER (VERSIONE MIGLIORATA PER MOBILE)
document.addEventListener("click", (e) => {
  
  // A. Tentativo di avvio musica al primo tocco
  if (!isMuted && bgMusic.paused) {
    playMusic();
  }

  // B. Effetto Sonoro Click
  // Cerca se l'elemento cliccato (o uno dei suoi genitori) è cliccabile
  const target = e.target.closest("button") || 
                 e.target.closest("a") || 
                 e.target.closest(".icon-link") ||
                 e.target.closest(".input-field"); // Aggiunto per i campi di testo

  if (target) {
    if (!isMuted) {
      // Metodo "REWIND": molto più veloce su mobile rispetto a cloneNode
      sfxClick.currentTime = 0; 
      
      // Promessa di play gestita per evitare errori in console
      const playPromise = sfxClick.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // I browser a volte bloccano i suoni rapidi, ignoriamo l'errore
          console.log("Audio click interrotto o bloccato");
        });
      }
    }
  }
});
