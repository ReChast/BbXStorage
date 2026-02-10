/***********************
 * REGISTRO EVENTI
 ***********************/

/* ====== STORAGE & DATA ====== */
const defaultEventi = {};
const provinceItaliane = ["MI", "RM", "NA", "TO", "FI", "LI", "BA", "PA", "BO", "VR", "VE"]; 

/* ====== APERTURA SEZIONE ====== */
function openRegistroEventi() {
  const eventi = storage.get("eventi", defaultEventi);

  document.getElementById("app").innerHTML = `
    <div class="header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
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
    return `<div class="list"><p style="opacity:.6; text-align:center;">Nessun evento registrato</p></div>`;
  }

  return mesi.map(mese => {
    eventi[mese].sort((a, b) => new Date(a.date) - new Date(b.date));

    const nomeMese = new Date(mese + "-01")
      .toLocaleDateString("it-IT", { month: "long", year: "numeric" })
      .toUpperCase();

    return `
      <div class="list" style="margin-bottom: 20px;">
        <h3>${nomeMese}</h3>
        ${eventi[mese].map((e, i) => renderEvento(e, mese, i)).join("")}
      </div>
    `;
  }).join("");
}

/* ====== EVENTO SINGOLO (RIGA) ====== */
function renderEvento(e, mese, index) {
  const giorno = new Date(e.date).getDate();

  const tipo = e.ranked ? `<span style="color:#ff6a00; font-weight:bold;">R</span>` : `<span style="opacity:0.7">U</span>`;
  
  const pinStyle = e.maps ? "cursor:pointer;" : "opacity:0.3; pointer-events:none;";
  const pinLink = e.maps ? `onclick="window.open('${e.maps}', '_blank')"` : "";

  return `
    <div class="item evento-row">
      <div class="ev-info">
        <span class="ev-day">${giorno}</span> 
        <span class="ev-loc">${e.provincia}</span>
        ${tipo}
        <span class="ev-price">${e.quota}€</span>
      </div>
      
      <div class="ev-actions">
        <span class="btn-icon" ${pinLink} style="${pinStyle}">📍</span>
        <span class="btn-icon" onclick="openDettagliEvento('${mese}', ${index})">🗒️</span>
        <span class="btn-icon trash" onclick="deleteEvento('${mese}', ${index})">🗑️</span>
      </div>
    </div>
  `;
}

/* ====== OVERLAY CREAZIONE / MODIFICA (LOGICA UNIFICATA) ====== */
function openOverlayEvento(meseToEdit = null, indexToEdit = null) {
  
  // 1. Variabili per gestire la modalità Modifica
  let isEdit = (meseToEdit !== null && indexToEdit !== null);
  let evt = {}; 
  
  // Se stiamo modificando, carichiamo i dati esistenti
  if (isEdit) {
    const eventi = storage.get("eventi", defaultEventi);
    evt = eventi[meseToEdit][indexToEdit];
    window.eventRanked = evt.ranked; // Impostiamo lo stato ranked salvato
  } else {
    // Se è nuovo, valori default
    window.eventRanked = false;
    evt = { date: "", checkin: "", start: "", provincia: "", location: "", indirizzo: "", maps: "", quota: "" };
  }

  // Definiamo le classi per i bottoni Ranked/Unranked
  const activeR = window.eventRanked ? "active" : "";
  const activeU = !window.eventRanked ? "active" : "";
  
  // Titolo e funzione del bottone Salva
  const titolo = isEdit ? "Modifica Evento" : "Nuovo Evento";
  // Se è modifica passiamo i vecchi indici, altrimenti niente
  const saveAction = isEdit ? `saveEvento('${meseToEdit}', ${indexToEdit})` : `saveEvento()`;

  document.body.insertAdjacentHTML("beforeend", `
    <div class="overlay">
      <div class="overlay-box">
        <h2 style="color:#ff6a00; text-align:center; margin-bottom:20px;">${titolo}</h2>

        <div class="form-scroll">
            <div class="form-group">
              <label>Quando</label>
              <input type="date" id="ev-date" value="${evt.date}">
            </div>

            <div class="form-row">
              <div class="form-group half">
                  <label>Check-in</label>
                  <input type="time" id="ev-checkin" value="${evt.checkin}">
              </div>
              <div class="form-group half">
                  <label>Start</label>
                  <input type="time" id="ev-start" value="${evt.start}">
              </div>
            </div>

            <div class="form-group">
              <label>Dove (Provincia)</label>
              <input list="province" id="ev-provincia" value="${evt.provincia}">
              <datalist id="province">
                  ${provinceItaliane.map(p => `<option value="${p}">`).join("")}
              </datalist>
            </div>

            <div class="form-group">
              <label>Location</label>
              <input id="ev-location" placeholder="Es. Nome Locale" value="${evt.location}">
            </div>

            <div class="form-group">
              <label>Indirizzo</label>
              <textarea id="ev-indirizzo" rows="2" placeholder="Via...">${evt.indirizzo}</textarea>
            </div>

            <div class="form-group">
              <label>Link Maps</label>
              <input id="ev-maps" placeholder="Incolla link Google Maps" value="${evt.maps}">
            </div>

            <div class="form-group">
              <div class="toggle-container">
                  <button id="rankedBtn" onclick="setRanked(true)" class="toggle-btn ${activeR}">Ranked</button>
                  <button id="unrankedBtn" onclick="setRanked(false)" class="toggle-btn ${activeU}">Unranked</button>
              </div>
            </div>

            <div class="form-group">
              <label>Quota (€)</label>
              <input id="ev-quota" type="number" min="0" value="${evt.quota}">
            </div>
        </div>

        <div class="actions-row">
          <button class="btn-full" onclick="${saveAction}">SALVA</button>
          <button class="btn-outline" onclick="closeOverlay()">ANNULLA</button>
        </div>
      </div>
    </div>
  `);
}

/* ====== OVERLAY DETTAGLI (SOLO LETTURA) ====== */
function openDettagliEvento(mese, index) {
  // Chiudiamo eventuali overlay aperti prima (sicurezza)
  closeOverlay();

  const eventi = storage.get("eventi", defaultEventi);
  const e = eventi[mese][index];

  const dataBella = new Date(e.date).toLocaleDateString("it-IT", { weekday: 'short', day: 'numeric', month: 'long' });
  const tipoLabel = e.ranked ? "<span style='color:#ff6a00'>RANKED</span>" : "UNRANKED";
  const mapLink = e.maps ? `<a href="${e.maps}" target="_blank" style="color:#ff6a00">Apri Mappa</a>` : "N/D";

  document.body.insertAdjacentHTML("beforeend", `
    <div class="overlay">
      <div class="overlay-box">
        <h2 style="text-align:center; color:#fff;">Dettagli</h2>
        
        <div class="details-list">
            <div class="detail-row">
                <label>Data</label>
                <div>${dataBella}</div>
            </div>
            <div class="detail-row">
                <label>Orari</label>
                <div>Check: ${e.checkin} | Start: ${e.start}</div>
            </div>
            <div class="detail-row">
                <label>Luogo</label>
                <div>${e.location} (${e.provincia})</div>
            </div>
            <div class="detail-row">
                <label>Indirizzo</label>
                <div style="font-size:0.9em; opacity:0.8">${e.indirizzo || "-"}</div>
            </div>
            <div class="detail-row">
                <label>Google Maps</label>
                <div>${mapLink}</div>
            </div>
            <div class="detail-row">
                <label>Tipo</label>
                <div>${tipoLabel}</div>
            </div>
            <div class="detail-row">
                <label>Quota</label>
                <div style="font-size:1.2em; color:#ff6a00; font-weight:bold;">${e.quota} €</div>
            </div>
        </div>

        <div class="actions-row" style="margin-top:20px;">
          <button class="btn-full" onclick="closeOverlay(); openOverlayEvento('${mese}', ${index})">MODIFICA</button>
          <button class="btn-outline" onclick="closeOverlay()">CHIUDI</button>
        </div>
      </div>
    </div>
  `);
}

/* ====== SALVATAGGIO (INTELLIGENTE) ====== */
// Accetta parametri opzionali: se ci sono, stiamo modificando un evento esistente
function saveEvento(oldMese = null, oldIndex = null) {
  const date = document.getElementById("ev-date").value;
  if (!date) return alert("Manca la data!");

  // 1. Gestione Link Maps (aggiunge https se manca)
  let mapLink = ev("ev-maps").trim();
  if (mapLink && !mapLink.startsWith("http://") && !mapLink.startsWith("https://")) {
    mapLink = "https://" + mapLink;
  }

  const eventi = storage.get("eventi", defaultEventi);

  // 2. SE STIAMO MODIFICANDO: Rimuoviamo prima il vecchio evento
  // (Così se hai cambiato la data, non rimane il duplicato nel mese vecchio)
  if (oldMese !== null && oldIndex !== null) {
    eventi[oldMese].splice(oldIndex, 1);
    // Pulizia: se il mese vecchio rimane vuoto, si potrebbe cancellare la chiave, 
    // ma renderCalendar lo gestisce già nascondendolo.
  }

  // 3. Creiamo/Inseriamo il nuovo evento
  const nuovoMese = date.slice(0, 7);
  if (!eventi[nuovoMese]) eventi[nuovoMese] = [];

  eventi[nuovoMese].push({
    date: date,
    checkin: ev("ev-checkin"),
    start: ev("ev-start"),
    provincia: ev("ev-provincia"),
    location: ev("ev-location"),
    indirizzo: ev("ev-indirizzo"),
    maps: mapLink,
    ranked: window.eventRanked,
    quota: Number(ev("ev-quota"))
  });

  storage.set("eventi", eventi);
  closeOverlay();
  openRegistroEventi();
}

/* ====== LOGICA UTILITY ====== */

function setRanked(val) {
  window.eventRanked = val;
  document.getElementById("rankedBtn").classList.toggle("active", val);
  document.getElementById("unrankedBtn").classList.toggle("active", !val);
}

function deleteEvento(mese, index) {
  if(!confirm("Eliminare evento definitivamente?")) return;
  const eventi = storage.get("eventi", defaultEventi);
  eventi[mese].splice(index, 1);
  storage.set("eventi", eventi);
  openRegistroEventi();
}

function ev(id) { return document.getElementById(id).value; }
function closeOverlay() { document.querySelector(".overlay")?.remove(); }
