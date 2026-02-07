function openpezzi() {
  const pezzi = storage.get("pezzi", defaultpezzi);

  document.getElementById("app").innerHTML = `
    <div class="header-tools">
      <input placeholder="Ricerca pezzo" oninput="filterpezzi(this.value)">
    </div>
    <div class="menu-tools">
      <button onclick="addpezzo()">Aggiungi pezzo</button>
      <button class="secondary" onclick="mainmenu()">Indietro</button>
    </div>

    <div class="table">
      ${Object.keys(pezzi).map(k => {
        // TRUCCO: Converto la chiave in minuscolo per cercare l'etichetta
        // Così "lameCX", "LameCX" e "lamecx" trovano tutti "Lame CX"
        const chiaveMinuscola = k.toLowerCase();
        const titolo = pezzilabels[k] || pezzilabels[chiaveMinuscola] || k;

        return `
        <div class="list">
          <h3>${titolo}</h3>
          ${pezzi[k].map((p,i)=>`
            <div class="item pezzo">
              <span>${p}</span>
              <span class="delete-btn" onclick="deletepezzo('${k}',${i})">🗑</span>
            </div>
          `).join("")}
        </div>
        `;
      }).join("")}
    </div>
  `;
}
