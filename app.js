function mainMenu() {
  document.getElementById("app").innerHTML = `
    <h1>BBX Tracker</h1>
    <div class="menu">
      <button onclick="openPezzi()">Pezzi</button>
      <button onclick="openCombo()">Combo</button>
      <button onclick="openRegistro()">Registro Risultati</button>
    </div>
  `;
}

mainMenu();