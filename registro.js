function openRegistro() {
  const reg = Storage.get("registro", []);
  document.getElementById("app").innerHTML = `
    <button onclick="addBattaglia()">Aggiungi Battaglia</button>
    <button onclick="addTorneo()">Aggiungi Torneo</button>
    <button class="secondary" onclick="mainMenu()">Indietro</button>

    ${reg.map(r=>`
      <div>${r.data} - ${r.tipo}</div>
    `).join("")}
  `;
}

function addBattaglia() {
  openOverlay(`
    <h2>Nuova Battaglia</h2>
    <input type="date" id="data">
    <button onclick="saveBattaglia()">Conferma</button>
    <button class="secondary" onclick="closeOverlay()">Indietro</button>
  `);
}

function saveBattaglia() {
  const data = document.getElementById("data").value;
  if (!data) return;

  const reg = Storage.get("registro", []);
  reg.push({ tipo:"Battaglia", data });
  Storage.set("registro", reg);
  closeOverlay();
  openRegistro();
}

function addTorneo() {
  alert("Struttura torneo pronta per round avanzati");
}