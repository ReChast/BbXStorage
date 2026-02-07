function mainMenu() {
  document.getElementById("app").innerHTML = `
    <div class="menu">
      <button onclick="openPezzi()">Pezzi</button>
      <button onclick="openCombo()">Combo</button>
      <button onclick="openRegistro()">Registro Risultati</button>
    </div>

    <div class="icon-bar">
      <a href="https://www.instagram.com/tps_bbx?igsh=MTJuYmhjYmZpZDJxaQ%3D%3D&utm_source=qr" target="_blank" class="icon-link">
        <img src="assets/iglink.png" alt="Link 1">
      </a>
      <a href="https://t.me/+kGy7DQaqUVRlZjI0" target="_blank" class="icon-link">
        <img src="assets/tglink.png" alt="Link 2">
      </a>
      <a href="https://link3.com" target="_blank" class="icon-link">
        <img src="assets/logo3.png" alt="Link 3">
      </a>
    </div>
  `;
}
