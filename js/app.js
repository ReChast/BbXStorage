function mainmenu() {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="menu">
      <button onclick="openpezzi()">Pezzi</button>
      <button onclick="opencombo()">Combo</button>
      <button onclick="openregistro()">Registro Risultati</button>
    </div>
    <div class="icon-bar">
      <a href="https://www.instagram.com/tps_bbx" target="_blank" class="icon-link">
        <img src="assets/iglink.jpeg" alt="IG">
      </a>
      <a href="https://t.me/+kGy7DQaqUVRlZjI0" target="_blank" class="icon-link">
        <img src="assets/tglink.jpeg" alt="TG">
      </a>
    </div>
  `;
}

mainMenu();
