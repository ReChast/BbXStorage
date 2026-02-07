function mainMenu() {
  document.getElementById("app").innerHTML = `
    <div class="menu">
      <button onclick="openPezzi()">Pezzi</button>
      <button onclick="openCombo()">Combo</button>
      <button onclick="openRegistro()">Registro Risultati</button>
    </div>

    <div class="external-links">
      <a href="https://t.me/+kGy7DQaqUVRlZjI0" target="_blank" class="logo-btn">
        <img src="assets/tglink.png" alt="Canale Telegram">
      </a>
      <a href="https://www.instagram.com/tps_bbx?igsh=MTJuYmhjYmZpZDJxaQ%3D%3D&utm_source=qr" target="_blank" class="logo-btn">
        <img src="assets/tglink.png" alt="Pagina Instagram">
      </a>
    </div>
  `;
}
