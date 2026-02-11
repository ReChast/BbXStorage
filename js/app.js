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

/* ====== SISTEMA AUDIO A BASSA LATENZA (WEB AUDIO API) ====== */

// 1. Creiamo il contesto audio (il motore sonoro)
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// Variabili per i suoni in memoria (Buffer)
let musicBuffer = null;
let clickBuffer = null;
let musicSource = null; // Serve per fermare/riavviare la musica

// Stato
let isMuted = localStorage.getItem("audioMuted") === "true";
const muteBtn = document.getElementById("mute-btn");

// 2. FUNZIONE PER CARICARE I SUONI IN MEMORIA (Fetch & Decode)
async function loadSound(url) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioCtx.decodeAudioData(arrayBuffer);
  } catch (error) {
    console.error("Errore caricamento suono:", url, error);
  }
}

// Carichiamo subito i file
async function initAudio() {
  musicBuffer = await loadSound('assets/music.mp3');
  clickBuffer = await loadSound('assets/click.mp3');
  updateUI();
}
initAudio(); // Avvia caricamento


// 3. FUNZIONE PER SUONARE IL CLICK (Istantaneo)
function playClickSound() {
  if (isMuted || !clickBuffer) return;

  // Crea una sorgente usa-e-getta (super veloce)
  const source = audioCtx.createBufferSource();
  source.buffer = clickBuffer;
  
  // Collega al volume e poi alle casse
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 1.0; // Volume click
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  source.start(0); // PARTI SUBITO
}


// 4. FUNZIONE PER LA MUSICA (Loop)
function playMusic() {
  if (isMuted || !musicBuffer) return;
  if (musicSource) return; // Sta già suonando

  musicSource = audioCtx.createBufferSource();
  musicSource.buffer = musicBuffer;
  musicSource.loop = true; // Ripeti all'infinito
  
  const gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.4; // Volume Musica
  
  musicSource.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  musicSource.start(0);
}

function stopMusic() {
  if (musicSource) {
    musicSource.stop();
    musicSource = null;
  }
}


// 5. GESTIONE MUTE
function toggleAudio() {
  isMuted = !isMuted;
  localStorage.setItem("audioMuted", isMuted);
  updateUI();

  if (isMuted) {
    stopMusic();
  } else {
    // Se il contesto è sospeso (succede su iOS), riattiviamolo
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    playMusic();
  }
}

function updateUI() {
  if (muteBtn) {
    muteBtn.innerText = isMuted ? "🔇" : "🔊";
    muteBtn.classList.toggle("active", !isMuted);
  }
}


// 6. SBLOCCO AUDIO IOS + TRIGGER SUONI
// iOS blocca l'audio finché non tocchi lo schermo.
// Usiamo 'touchstart' per intercettare il tocco PRIMA del click.

let unlocked = false;

document.addEventListener('touchstart', (e) => {
  // A. Sblocco iniziale (solo la prima volta)
  if (!unlocked) {
    audioCtx.resume().then(() => {
      unlocked = true;
      if (!isMuted) playMusic();
    });
  }

  // B. SUONO CLICK (Se tocchi un bottone)
  // Usiamo touchstart: è 300ms più veloce del click!
  const target = e.target.closest("button") || 
                 e.target.closest("a") || 
                 e.target.closest(".icon-link") ||
                 e.target.closest(".input-field");

  if (target && target.id !== "mute-btn") {
    playClickSound();
  }

}, { passive: true }); // passive: true migliora le prestazioni dello scroll
