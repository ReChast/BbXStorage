function mainMenu() {
  document.getElementById("app").innerHTML = `
    <div class="menu">
      <button onclick="openPezzi()">Pezzi</button>
      <button onclick="openCombo()">Combo</button>
      <button onclick="openRegistro()">Registro Risultati</button>
    </div>

    <div class="icon-bar">
      <a href="https://www.instagram.com/tps_bbx?igsh=MTJuYmhjYmZpZDJxaQ%3D%3D&utm_source=qr" target="_blank" class="icon-link">
        <img src="assets/iglink.jpeg" alt="Link 1">
      </a>
      <a href="https://t.me/+kGy7DQaqUVRlZjI0" target="_blank" class="icon-link">
        <img src="assets/tglink.jpeg" alt="Link 2">
      </a>
       
    </div>
  `;
}
