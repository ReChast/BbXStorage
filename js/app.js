function mainMenu() {
  document.getElementById("app").innerHTML = `
    
    <div class="menu">
      <button onclick="openPezzi()">Pezzi</button>
      <button onclick="openCombo()">Combo</button>
      <button onclick="openRegistro()">Registro Risultati</button>
    </div>
  `;
}

mainMenu();
