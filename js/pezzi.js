const pezzilabels = {
  // Compatibilità maiuscole/minuscole
  lamecx: "Lame CX",
  lameCX: "Lame CX", 
  assist: "Assist",
  lameuxbx: "Lame UX / BX",
  lameUXBX: "Lame UX / BX",
  ratchet: "Ratchet",
  bit: "Bit",
  varie: "Varie"
};

const defaultpezzi = {
  lamecx: [],
  assist: [],
  lameuxbx: [],
  ratchet: [],
  bit: [],
  varie: []
};

function openpezzi() {
  const pezzi = storage.get("pezzi", defaultpezzi);

  document.getElementById("app").innerHTML = `
    <div class="header-tools">
      <input placeholder="Ricerca pezzo" oninput="filterpezzi(this.value)">
    </div>
    <div class="menu-tools">
      <button onclick="addpezzo()">Aggiungi pezzo</button>
      <button class="secondary" onclick="mainmenu()">Indietro</button>
    </div>

    <div class="table">
      ${Object.keys(pezzi).map(k => {
        // Logica per trovare il titolo corretto
        const chiaveMinuscola = k.toLowerCase();
        const titolo = pezzilabels[k] || pezzilabels[chiaveMinuscola] || k;

        return `
        <div class="list">
          <h3>${titolo}</h3>
          ${pezzi[k].map((p,i)=>`
            <div class="item pezzo">
              <span>${p}</span>
              <span class="delete-btn" onclick="deletepezzo('${k}',${i})">🗑</span>
            </div>
          `).join("")}
        </div>
        `;
      }).join("")}
    </div>
  `;
}

function addpezzo() {
  // Usa openOverlay (definito in ui.js)
  openOverlay(`
    <h2>Aggiungi pezzo</h2>
    
    <div style="margin-bottom:15px;">
      <label style="display:block; margin-bottom:5px; color:#ff8c00; font-size:14px;">Nome</label>
      <input id="nome" placeholder="Nome del pezzo" style="width:100%; box-sizing:border-box; padding:10px;">
    </div>
    
    <div style="margin-bottom:15px;">
      <label style="display:block; margin-bottom:5px; color:#ff8c00; font-size:14px;">Categoria</label>
      <select id="tipo" style="width:100%; padding:10px; background:#222; color:white; border:1px solid #444; border-radius:5px;">
        <option value="lamecx">Lama CX</option>
        <option value="assist">Assist</option>
        <option value="lameuxbx">Lama UX/BX</option>
        <option value="ratchet">Ratchet</option>
        <option value="bit">Bit</option>
        <option value="varie">Varie</option>
      </select>
    </div>

    <div style="margin-top:20px; display:flex; gap:10px;">
      <button onclick="confirmaddpezzo()" style="flex:1;">Conferma</button>
      <button class="secondary" onclick="closeOverlay()" style="flex:1;">Annulla</button>
    </div>
  `);
}

function confirmaddpezzo() {
  const nome = document.getElementById("nome").value;
  const tipo = document.getElementById("tipo").value;
  if (!nome) return;

  const pezzi = storage.get("pezzi", defaultpezzi);
  
  // Creiamo l'array se non esiste (sicurezza)
  if (!pezzi[tipo]) pezzi[tipo] = [];
  
  pezzi[tipo].push(nome);
  storage.set("pezzi", pezzi);
  closeOverlay();
  openpezzi(); 
}

function deletepezzo(tipo, index) {
  if (!confirm("Eliminare?")) return;
  const pezzi = storage.get("pezzi", defaultpezzi);
  pezzi[tipo].splice(index,1);
  storage.set("pezzi", pezzi);
  openpezzi();
}

function filterpezzi(q) {
  document.querySelectorAll(".pezzo").forEach(p=>{
    const span = p.querySelector('span');
    if(span) {
      const text = span.innerText;
      p.style.display = text.toLowerCase().includes(q.toLowerCase()) ? "flex" : "none";
    }
  });
}
