const pezzilabels = {
  lamecx: "Lame CX",
  assist: "Assist",
  lameuxbx: "Lame UX / BX",
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
      ${Object.keys(pezzi).map(k => `
        <div class="list">
          <h3>${pezzilabels[k] ?? k}</h3>
          ${pezzi[k].map((p,i)=>`
            <div class="item pezzo">
              <span>${p}</span>
              <span class="delete-btn" onclick="deletepezzo('${k}',${i})">🗑</span>
            </div>
          `).join("")}
        </div>
      `).join("")}
    </div>
  `;
}

function addpezzo() {
  openOverlay(`
    <h2>Aggiungi pezzo</h2>
    <input id="nome" placeholder="Nome del pezzo">
    <br><br>
    <select id="tipo">
      <option value="lamecx">Lama CX</option>
      <option value="assist">Assist</option>
      <option value="lameuxbx">Lama UX/BX</option>
      <option value="ratchet">Ratchet</option>
      <option value="bit">Bit</option>
      <option value="varie">Varie</option>
    </select>
    <div style="margin-top:20px; display:flex; gap:10px;">
      <button onclick="confirmaddpezzo()">Conferma</button>
      <button class="secondary" onclick="closeOverlay()">Annulla</button>
    </div>
  `);
}

function confirmaddpezzo() {
  const nome = document.getElementById("nome").value;
  const tipo = document.getElementById("tipo").value;
  if (!nome) return;

  const pezzi = storage.get("pezzi", defaultpezzi);
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
    const text = p.querySelector('span').innerText;
    p.style.display = text.toLowerCase().includes(q.toLowerCase()) ? "flex" : "none";
  });
}
