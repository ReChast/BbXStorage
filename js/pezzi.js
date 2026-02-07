const pezziLabels = {
  lameCX: "Lame CX",
  assist: "Assist",
  lameUXBX: "Lame UX / BX",
  ratchet: "Ratchet",
  bit: "Bit",
  varie: "Varie"
};

const defaultPezzi = {
  lameCX: [],
  assist: [],
  lameUXBX: [],
  ratchet: [],
  bit: [],
  varie: []
};

function openPezzi() {
  const pezzi = Storage.get("pezzi", defaultPezzi);

  document.getElementById("app").innerHTML = `
    <input placeholder="Ricerca pezzo" oninput="filterPezzi(this.value)">
    <button onclick="addPezzo()">Aggiungi pezzo</button>
    <button class="secondary" onclick="mainMenu()">Indietro</button>

    <div class="table">
      ${Object.keys(pezzi).map(k => `
        <div class="list">
          <h3>${pezziLabels[k] ?? k}</h3>
          ${pezzi[k].map((p,i)=>`
            <div class="item pezzo">
              ${p}
              <span onclick="deletePezzo('${k}',${i})">🗑</span>
            </div>
          `).join("")}
        </div>
      `).join("")}
    </div>
  `;
}

function addPezzo() {
  openOverlay(`
    <h2>Aggiungi pezzo</h2>
    <input id="nome">
    <select id="tipo">
      <option value="lameCX">Lama CX</option>
      <option value="assist">Assist</option>
      <option value="lameUXBX">Lama UX/BX</option>
      <option value="ratchet">Ratchet</option>
      <option value="bit">Bit</option>
      <option value="varie">Varie</option>
    </select>
    <button onclick="confirmAddPezzo()">Conferma</button>
    <button class="secondary" onclick="closeOverlay()">Annulla</button>
  `);
}

function confirmAddPezzo() {
  const nome = document.getElementById("nome").value;
  const tipo = document.getElementById("tipo").value;
  if (!nome) return;

  const pezzi = Storage.get("pezzi", defaultPezzi);
  pezzi[tipo].push(nome);
  Storage.set("pezzi", pezzi);
  closeOverlay();
  openPezzi();
}

function deletePezzo(tipo, index) {
  if (!confirm("Eliminare?")) return;
  const pezzi = Storage.get("pezzi", defaultPezzi);
  pezzi[tipo].splice(index,1);
  Storage.set("pezzi", pezzi);
  openPezzi();
}

function filterPezzi(q) {
  document.querySelectorAll(".pezzo").forEach(p=>{
    p.style.display = p.innerText.toLowerCase().includes(q.toLowerCase()) ? "" : "none";
  });
}
