function openCombo() {
  document.getElementById("app").innerHTML = `
    <h2>Combo</h2>
    <button onclick="openlistacombo()">Lista Combo</button>
    <button class="secondary" onclick="mainMenu()">Indietro</button>
  `;
}

function openListaCombo() {
  const combo = Storage.get("combo", []);

  document.getElementById("app").innerHTML = `
    <button onclick="openricercacombo()">Ricerca</button>
    <button onclick="createCombo()">Crea</button>
    <button class="secondary" onclick="openCombo()">Indietro</button>

    <h3>Combo CX</h3>
    ${combo.filter(c=>c.tipo==="CX").map((c,i)=>renderCombo(c,i)).join("")}

    <h3>Combo UX/BX</h3>
    ${combo.filter(c=>c.tipo==="UXBX").map((c,i)=>renderCombo(c,i)).join("")}
  `;
}

function renderCombo(c, index) {
  return `
    <div class="item">
      <span>${formatCombo(c)}</span>
      <span>
        <button onclick="openStats(${index})">📊</button>
        <button onclick="deleteCombo(${index})">🗑</button>
      </span>
    </div>
  `;
}

function formatCombo(c) {
  return c.tipo === "CX"
    ? `${c.chip} - ${c.lama} - ${c.assist} - ${c.ratchet} - ${c.bit}`
    : `${c.lama} - ${c.ratchet} - ${c.bit}`;
}

function createCombo() {
  openOverlay(`
    <h2>Nuova Combo</h2>
    <button onclick="createCX()">Combo CX</button>
    <button onclick="createUX()">Combo UX/BX</button>
    <button class="secondary" onclick="closeOverlay()">Annulla</button>
  `);
}

function deleteCombo(index) {
  if (!confirm("Eliminare?")) return;
  const combo = Storage.get("combo", []);
  combo.splice(index,1);
  Storage.set("combo", combo);
  openListaCombo();
}

function openRicercaCombo() {
  openOverlay(`
    <h2>Ricerca Combo</h2>

    <button onclick="searchCX()">Combo CX</button>
    <button onclick="searchUX()">Combo UX/BX</button>

    <button class="secondary" onclick="closeOverlay()">Indietro</button>
  `);
}

function searchCX() {
  const pezzi = Storage.get("pezzi", defaultPezzi);

  openOverlay(`
    <h2>Ricerca Combo CX</h2>

    <select id="lama">
      <option value="">-- Lama CX --</option>
      ${pezzi.lameCX.map(l=>`<option>${l}</option>`).join("")}
    </select>

    <button onclick="executeSearch('CX')">Cerca</button>
    <button class="secondary" onclick="closeOverlay()">Indietro</button>
  `);
}

function searchUX() {
  const pezzi = Storage.get("pezzi", defaultPezzi);

  openOverlay(`
    <h2>Ricerca Combo UX/BX</h2>

    <select id="lama">
      <option value="">-- Lama UX/BX --</option>
      ${pezzi.lameUXBX.map(l=>`<option>${l}</option>`).join("")}
    </select>

    <button onclick="executeSearch('UXBX')">Cerca</button>
    <button class="secondary" onclick="closeOverlay()">Indietro</button>
  `);
}

function executeSearch(tipo) {
  const lama = document.getElementById("lama").value;
  if (!lama) return;

  const combo = Storage.get("combo", []);
  const risultati = combo.filter(c => c.tipo === tipo && c.lama === lama);

  closeOverlay();

  document.getElementById("app").innerHTML = `
    <h2>Risultati</h2>
    ${risultati.map((c,i)=>renderCombo(c,i)).join("")}
    <button class="secondary" onclick="openListaCombo()">Indietro</button>
  `;
}

function openStats(index) {
  const combo = Storage.get("combo", []);
  const c = combo[index];

  c.win ??= 0;
  c.lose ??= 0;

  const total = c.win + c.lose;
  const perc = total ? Math.round((c.win / total) * 100) : 0;
  const color = perc >= 56 ? "green" : perc >= 45 ? "yellow" : "red";

  openOverlay(`
    <h2>Statistiche Combo</h2>

    <div style="display:flex; justify-content:space-between">
      <div>
        <h3>Vinte</h3>
        <input type="number" id="win" value="${c.win}">
      </div>
      <div>
        <h3>Perse</h3>
        <input type="number" id="lose" value="${c.lose}">
      </div>
    </div>

    <h3 style="color:${color}">Winrate: ${perc}%</h3>

    <button onclick="saveStats(${index})">Salva</button>
    <button class="secondary" onclick="closeOverlay()">Indietro</button>
  `);
}

function saveStats(index) {
  const combo = Storage.get("combo", []);
  combo[index].win = parseInt(document.getElementById("win").value) || 0;
  combo[index].lose = parseInt(document.getElementById("lose").value) || 0;
  Storage.set("combo", combo);
  closeOverlay();
  openListaCombo();
}

function createCX() {
  const pezzi = Storage.get("pezzi", defaultPezzi);

  openOverlay(`
    <h2>Nuova Combo CX</h2>

    ${select("chip", pezzi.varie)}
    ${select("lama", pezzi.lameCX)}
    ${select("assist", pezzi.assist)}
    ${select("ratchet", pezzi.ratchet)}
    ${select("bit", pezzi.bit)}

    <button id="confirm" disabled onclick="saveCX()">Conferma</button>
    <button class="secondary" onclick="closeOverlay()">Annulla</button>
  `);

  enableCheck();
}

function select(id, list) {
  return `
    <select id="${id}" onchange="enableCheck()">
      <option value="">-- ${id} --</option>
      ${list.map(p => `<option>${p}</option>`).join("")}
    </select>
  `;
}

function enableCheck() {
  const btn = document.getElementById("confirm");
  const inputs = [...document.querySelectorAll("select")];
  btn.disabled = inputs.some(i => !i.value);
}

function createUX() {
  const pezzi = Storage.get("pezzi", defaultPezzi);

  openOverlay(`
    <h2>Nuova Combo UX/BX</h2>

    ${select("lama", pezzi.lameUXBX)}
    ${select("ratchet", pezzi.ratchet)}
    ${select("bit", pezzi.bit)}

    <button id="confirm" disabled onclick="saveUX()">Conferma</button>
    <button class="secondary" onclick="closeOverlay()">Annulla</button>
  `);

  enableCheck();
}

function saveCX() {
  const combo = Storage.get("combo", []);
  combo.push({
    tipo: "CX",
    chip: chip.value,
    lama: lama.value,
    assist: assist.value,
    ratchet: ratchet.value,
    bit: bit.value
  });
  Storage.set("combo", combo);
  closeOverlay();
  openListaCombo();
}

function saveUX() {
  const combo = Storage.get("combo", []);
  combo.push({
    tipo: "UXBX",
    lama: lama.value,
    ratchet: ratchet.value,
    bit: bit.value
  });
  Storage.set("combo", combo);
  closeOverlay();
  openListaCombo();
}
