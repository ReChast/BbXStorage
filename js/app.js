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

/* ====== AUDIO SYSTEM IBRIDO (Click Istantaneo + Musica Streaming) ====== */

// --- 1. SETUP CLICK (Web Audio API - Per velocità massima) ---
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
let clickBuffer = null;

// Carichiamo solo il CLICK in memoria (è piccolo, ci mette un attimo)
async function loadClick() {
  try {
    const response = await fetch('assets/click.mp3');
    const arrayBuffer = await response.arrayBuffer();
    clickBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  } catch (e) { console.error("Errore click:", e); }
}
loadClick(); // Avvia subito

function playClickSound() {
  if (isMuted || !clickBuffer) return;
  
  // Riattiva il contesto se iOS lo ha sospeso
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const source = audioCtx.createBufferSource();
  source.buffer = clickBuffer;
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 1.0; // Volume Click
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  source.start(0);
}


// --- 2. SETUP MUSICA (HTML5 Audio - Per avvio rapido in streaming) ---
const bgMusic = new Audio('assets/music.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.4; // Volume Musica
bgMusic.preload = 'auto'; // Dice al browser di iniziare a scaricare subito

// Stato
let isMuted = localStorage.getItem("audioMuted") === "true";
const muteBtn = document.getElementById("mute-btn");
let musicStarted = false; // Serve per sapere se la musica è già partita una volta

// --- 3. LOGICA DI SBLOCCO (Il cuore del sistema) ---

// Funzione che prova ad avviare tutto
function tryStartAudio() {
  // A. Sblocca il motore dei Click
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  // B. Avvia la musica (se non è muto e non è già partita)
  if (!isMuted && !musicStarted) {
    // Il play restituisce una promessa: gestiamo errori (es. utente non ha ancora interagito abbastanza)
    const playPromise = bgMusic.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        musicStarted = true;
        // Rimuoviamo il listener "touchstart" perché ormai abbiamo sbloccato tutto
        document.removeEventListener('touchstart', tryStartAudio);
        document.removeEventListener('click', tryStartAudio);
      }).catch(error => {
        console.log("Autoplay bloccato, riproverò al prossimo tocco.");
      });
    }
  }
}

// Ascoltiamo il primo tocco ovunque per far partire la festa
document.addEventListener('touchstart', tryStartAudio, { passive: true });
document.addEventListener('click', tryStartAudio, { passive: true });


// --- 4. GESTIONE TOGGLE MUTE ---
function toggleAudio() {
  isMuted = !isMuted;
  localStorage.setItem("audioMuted", isMuted);
  updateUI();

  if (isMuted) {
    bgMusic.pause();
  } else {
    // Se riattiviamo l'audio, proviamo a far ripartire la musica
    // Se l'utente ha già toccato lo schermo, partirà subito.
    bgMusic.play().catch(e => console.log(e));
    if (audioCtx.state === 'suspended') audioCtx.resume();
  }
}

function updateUI() {
  if (muteBtn) {
    muteBtn.innerText = isMuted ? "🔇" : "🔊";
    muteBtn.classList.toggle("active", !isMuted);
  }
}
// Setta l'icona iniziale corretta
updateUI();


// --- 5. TRIGGER CLICK (Ignora Swipe) ---
document.addEventListener('click', (e) => {
  // Verifica se abbiamo cliccato un elemento interattivo
  const target = e.target.closest("button") || 
                 e.target.closest("a") || 
                 e.target.closest(".icon-link") ||
                 e.target.closest(".input-field");

  // Se è un bottone e NON è il tasto mute (per evitare doppio feedback)
  if (target && target.id !== "mute-btn") {
    playClickSound();
  }
});
