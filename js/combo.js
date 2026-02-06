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
  // recupera pezzi e costruisce select
  // struttura già pronta per estensione
  alert("CX pronta per essere completata");
}

function createUX() {
  alert("UX/BX pronta per essere completata");
}