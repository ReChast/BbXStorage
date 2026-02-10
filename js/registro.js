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
  
  // Icona Mappa (grigia se non c'è, colorata se c'è)
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

/* ====== OVERLAY CREAZIONE EVENTO (INPUT) ====== */
function openOverlayEvento() {
  document.body.insertAdjacentHTML("beforeend", `
    <div class="overlay">
      <div class="overlay-box">
        <h2 style="color:#ff6a00; text-align:center; margin-bottom:20px;">Nuovo Evento</h2>

        <div class="form-scroll">
            <div class="form-group">
            <label>Quando</label>
            <input type="date" id="ev-date" style="width:100%">
            </div>

            <div class="form-row">
            <div class="form-group half">
                <label>Check-in</label>
                <input type="time" id="ev-checkin" style="width:100%">
            </div>
            <div class="form-group half">
                <label>Start</label>
                <input type="time" id="ev-start" style="width:100%">
            </div>
            </div>

            <div class="form-group">
            <label>Dove (Provincia)</label>
            <input list="province" id="ev-provincia" style="width:100%">
            <datalist id="province">
                ${provinceItaliane.map(p => `<option value="${p}">`).join("")}
            </datalist>
            </div>

            <div class="form-group">
            <label>Location</label>
            <input id="ev-location" placeholder="Es. Nome Locale" style="width:100%">
            </div>

            <div class="form-group">
            <label>Indirizzo</label>
            <textarea id="ev-indirizzo" rows="2" placeholder="Via..." style="width:100%"></textarea>
            </div>

            <div class="form-group">
            <label>Link Maps</label>
            <input id="ev-maps" placeholder="Incolla link Google Maps" style="width:100%">
            </div>

            <div class="form-group">
            <div class="toggle-container">
                <button id="rankedBtn" onclick="setRanked(true)" class="toggle-btn">Ranked</button>
                <button id="unrankedBtn" onclick="setRanked(false)" class="toggle-btn active">Unranked</button>
            </div>
            </div>

            <div class="form-group">
            <label>Quota (€)</label>
            <input id="ev-quota" type="number" min="0" style="width:100%">
            </div>
        </div>

        <div class="actions-row">
          <button class="btn-full" onclick="saveEvento()">SALVA</button>
          <button class="btn-outline" onclick="closeOverlay()">ANNULLA</button>
        </div>
      </div>
    </div>
  `);
  window.eventRanked = false;
}

/* ====== OVERLAY DETTAGLI (SOLO LETTURA) ====== */
function openDettagliEvento(mese, index) {
  const eventi = storage.get("eventi", defaultEventi);
  const e = eventi[mese][index];

  // Formattazione dati
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
          <button class="btn-outline" onclick="closeOverlay()" style="width:100%">CHIUDI</button>
        </div>
      </div>
    </div>
  `);
}

/* ====== LOGICA ====== */
function setRanked(val) {
  window.eventRanked = val;
  document.getElementById("rankedBtn").classList.toggle("active", val);
  document.getElementById("unrankedBtn").classList.toggle("active", !val);
}

/* ====== SALVATAGGIO EVENTO (CORRETTO) ====== */

function saveEvento() {
  const date = document.getElementById("ev-date").value;
  if (!date) return alert("Manca la data!");

  // 1. Recuperiamo il valore della mappa
  let mapLink = ev("ev-maps").trim();

  // 2. Se c'è un link, controlliamo se ha il protocollo
  if (mapLink && !mapLink.startsWith("http://") && !mapLink.startsWith("https://")) {
    mapLink = "https://" + mapLink;
  }

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
    maps: mapLink, // Usiamo il link corretto
    ranked: window.eventRanked,
    quota: Number(ev("ev-quota"))
  });

  storage.set("eventi", eventi);
  closeOverlay();
  openRegistroEventi();
}


function deleteEvento(mese, index) {
  if(!confirm("Eliminare evento?")) return;
  const eventi = storage.get("eventi", defaultEventi);
  eventi[mese].splice(index, 1);
  storage.set("eventi", eventi);
  openRegistroEventi();
}

function ev(id) { return document.getElementById(id).value; }
function closeOverlay() { document.querySelector(".overlay")?.remove(); }
