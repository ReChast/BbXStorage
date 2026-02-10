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
