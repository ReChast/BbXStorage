/***********************
 * REGISTRO EVENTI
 ***********************/

/* ====== STORAGE ====== */
const defaultEventi = {};

// AGGIUNTA NECESSARIA: Lista delle province per far funzionare la map()
const provinceItaliane = ["MI", "RM", "NA", "TO", "FI", "LI", "BA", "PA", "BO"]; 

/* ====== APERTURA SEZIONE ====== */

function openRegistroEventi() {
  const eventi = storage.get("eventi", defaultEventi);

  document.getElementById("app").innerHTML = `
    <div class="header">
      <button onclick="mainmenu()">⬅ Indietro</button>
      <button onclick="openOverlayEvento()">➕ Crea Evento</button>
    </div>

    <div id="calendar">
      ${renderCalendar(eventi)}
    </div>
  `;
}

/* ====== CALENDARIO ====== */

function renderCalendar(eventi) {
  const mesi = Object.keys(eventi).sort();

  if (mesi.length === 0) {
    return `<p style="opacity:.6">Nessun evento registrato</p>`;
  }

  return mesi.map(mese => {
    eventi[mese].sort((a, b) => new Date(a.date) - new Date(b.date));

    const nomeMese = new Date(mese + "-01")
      .toLocaleDateString("it-IT", { month: "long", year: "numeric" })
      .toUpperCase();

    return `
      <div class="mese">
        <h3>${nomeMese}</h3>
        ${eventi[mese].map((e, i) => renderEvento(e, mese, i)).join("")}
      </div>
    `;
  }).join("");
}

/* ====== EVENTO SINGOLO ====== */

function renderEvento(e, mese, index) {
  const giorno = new Date(e.date).getDate();

  const tipo = e.ranked
    ? `<span class="ranked">R</span>`
    : `<span class="unranked">U</span>`;

  const pin = e.maps
    ? `<a href="${e.maps}" target="_blank">📍</a>`
    : "";

  return `
    <div class="evento">
      ${giorno} ${e.provincia} -
      ${tipo} -
      ${e.quota}€ -
      ${e.checkin}
      ${pin}
      <button class="trash" onclick="deleteEvento('${mese}', ${index})">🗑️</button>
    </div>
  `;
}

/* ====== OVERLAY CREAZIONE EVENTO ====== */

function openOverlayEvento() {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="overlay">
      <div class="modal">
        <h3>Crea Evento</h3>

        <div class="form-group">
          <label>Quando</label>
          <input type="date" id="ev-date">
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label>Check-in</label>
            <input type="time" id="ev-checkin">
          </div>
          <div class="form-group half">
            <label>Start</label>
            <input type="time" id="ev-start">
          </div>
        </div>

        <div class="form-group">
          <label>Dove (Provincia)</label>
          <input list="province" id="ev-provincia">
          <datalist id="province">
            ${provinceItaliane.map(p => `<option value="${p}">`).join("")}
          </datalist>
        </div>

        <div class="form-group">
          <label>Location (Nome locale)</label>
          <input id="ev-location" placeholder="Es. 21st Century Manga">
        </div>

        <div class="form-group">
          <label>Indirizzo</label>
          <textarea id="ev-indirizzo" rows="2" placeholder="Via Palestro 17..."></textarea>
        </div>

        <div class="form-group">
          <label>Link GMaps</label>
          <input id="ev-maps">
        </div>

        <div class="form-group toggle-group">
          <label>Tipologia</label>
          <div class="toggle">
            <button id="rankedBtn" onclick="setRanked(true)">Ranked</button>
            <button id="unrankedBtn" onclick="setRanked(false)" class="active">Unranked</button>
          </div>
        </div>

        <div class="form-group">
          <label>Quota (€)</label>
          <input id="ev-quota" type="number" min="0">
        </div>

        <div class="actions">
          <button class="btn-save" onclick="saveEvento()">Salva</button>
          <button class="btn-cancel" onclick="closeOverlay()">Annulla</button>
        </div>
      </div>
    </div>
  `);

  window.eventRanked = false;
}


/* ====== RANKED / UNRANKED ====== */

function setRanked(val) {
  window.eventRanked = val;
  document.getElementById("rankedBtn").classList.toggle("active", val);
  document.getElementById("unrankedBtn").classList.toggle("active", !val);
}

/* ====== SALVATAGGIO EVENTO ====== */

function saveEvento() {
  const date = document.getElementById("ev-date").value;
  if (!date) return alert("Seleziona una data");

  const mese = date.slice(0, 7);
  const eventi = storage.get("eventi", defaultEventi);

  if (!eventi[mese]) eventi[mese] = [];

  eventi[mese].push({
    date: date,
    checkin: ev("ev-checkin"),
    start: ev("ev-start"),
    provincia: ev("ev-provincia"),
    location: ev("ev-location"),
    indirizzo: ev("ev-indirizzo"),
    maps: ev("ev-maps"),
    ranked: window.eventRanked,
    quota: Number(ev("ev-quota"))
  });

  storage.set("eventi", eventi);
  closeOverlay(); // Chiama la versione con O maiuscola
  openRegistroEventi();
}

/* ====== ELIMINAZIONE EVENTO ====== */

function deleteEvento(mese, index) {
  const eventi = storage.get("eventi", defaultEventi);
  eventi[mese].splice(index, 1);
  storage.set("eventi", eventi);
  openRegistroEventi();
}

/* ====== UTIL ====== */

function ev(id) {
  return document.getElementById(id).value;
}

// CORREZIONE 2: CamelCase per corrispondere alle chiamate sopra
function closeOverlay() {
  document.querySelector(".overlay")?.remove();
}
