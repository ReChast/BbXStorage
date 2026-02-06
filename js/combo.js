function openCombo() {
  document.getElementById("app").innerHTML = `
    <h2>Combo</h2>
    <button onclick="openListaCombo()">Lista Combo</button>
    <button class="secondary" onclick="mainMenu()">Indietro</button>
  `;
}

function openListaCombo() {
  const combo = Storage.get("combo", []);
  document.getElementById("app").innerHTML = `
    <button onclick="createCombo()">Crea</button>
    <button class="secondary" onclick="openCombo()">Indietro</button>

    <h3>Combo registrate</h3>
    ${combo.map(c=>`
      <div>${Object.values(c).join(" - ")}</div>
    `).join("")}
  `;
}

function createCombo() {
  openOverlay(`
    <h2>Nuova Combo</h2>
    <button onclick="createCX()">Combo CX</button>
    <button onclick="createUX()">Combo UX/BX</button>
    <button class="secondary" onclick="closeOverlay()">Annulla</button>
  `);
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
