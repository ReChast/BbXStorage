const defaultcombos = [];

function opencombo() {
  const combos = storage.get("combos", defaultcombos);

  document.getElementById("app").innerHTML = `
    <div class="header-tools">
      <input placeholder="Cerca combo..." oninput="filtercombo(this.value)">
    </div>
    
    <div class="menu-tools">
      <button onclick="addcombo()">Crea Nuova Combo</button>
      <button class="secondary" onclick="mainmenu()">Indietro</button>
    </div>

    <div class="table">
      ${combos.length === 0 ? `<p style="text-align:center; opacity:0.7; margin-top:20px;">Nessuna combo salvata</p>` : ''}
      
      ${combos.map((c, i) => {
        const vinte = c.wins || 0;
        const perse = c.losses || 0;
        const totali = vinte + perse;
        let percent = 0;
        let color = "#888"; 

        if (totali > 0) {
          percent = Math.round((vinte / totali) * 100);
          if (percent <= 40) color = "#ff4d4d";
          else if (percent <= 59) color = "#ffcc00";
          else color = "#00e676";
        }

        const winString = totali > 0 ? `${percent}%` : "-";

        let stringaPezzi = "";
        if (c.tipo === "cx") {
          stringaPezzi = `${c.chip || "?"} ${c.lama} ${c.assist || ""} ${c.ratchet} ${c.bit}`;
        } else {
          stringaPezzi = `${c.lama} ${c.ratchet} ${c.bit}`;
        }

        return `
        <div class="list combo-item" data-name="${c.nome.toLowerCase()}">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
            <h3 style="margin:0; color:#fff; font-size:18px;">${c.nome}</h3>
            <div style="font-weight:bold; color:${color}; font-size:18px; background:rgba(0,0,0,0.5); padding:2px 8px; border-radius:6px; border:1px solid ${color}">
              ${winString}
            </div>
          </div>
          <div style="font-size:14px; color:#aaa; margin-bottom:15px; font-style:italic;">
            ${stringaPezzi}
          </div>
          <div style="display:flex; gap:10px;">
            <button style="flex:1; padding:10px; font-size:14px; background:#333; border:1px solid #555;" onclick="editstats(${i})">
              📊 Statistiche
            </button>
            <button class="secondary" style="width:50px; padding:10px;" onclick="deletecombo(${i})">
              🗑
            </button>
          </div>
        </div>
        `;
      }).join("")}
    </div>
  `;
}

function addcombo() {
  openOverlay(`
    <h2>Nuova Combo</h2>
    <label>Nome Combo</label>
    <input id="new-nome" placeholder="Es. Dran Sword...">

    <label style="margin-top:15px; display:block;">Tipo Sistema</label>
    <div style="display:flex; gap:10px; margin-bottom:15px;">
      <button id="btn-std" onclick="settype('std')" style="background:#444;">UX / BX</button>
      <button id="btn-cx" onclick="settype('cx')" class="secondary">CX</button>
    </div>
    <input type="hidden" id="new-tipo" value="std">
    <div id="fields-container"></div>

    <div style="margin-top:20px; display:flex; gap:10px;">
      <button onclick="savecombo()">Salva</button>
      <button class="secondary" onclick="closeOverlay()">Annulla</button>
    </div>
  `);
  setTimeout(() => settype('std'), 100); 
}

window.settype = function(tipo) {
  const container = document.getElementById("fields-container");
  const btnStd = document.getElementById("btn-std");
  const btnCx = document.getElementById("btn-cx");
  const hiddenInput = document.getElementById("new-tipo");
  
  if(tipo === 'std') {
    btnStd.className = ""; btnStd.style.background = "#ff8c00"; btnStd.style.color = "#000";
    btnCx.className = "secondary"; btnCx.style = "";
  } else {
    btnCx.className = ""; btnCx.style.background = "#ff8c00"; btnCx.style.color = "#000";
    btnStd.className = "secondary"; btnStd.style = "";
  }
  hiddenInput.value = tipo;

  const inv = storage.get("pezzi", { lamecx:[], lameuxbx:[], ratchet:[], bit:[], assist:[] });
  
  // CORREZIONE SICUREZZA PER NOMI MAIUSCOLI/MINUSCOLI
  const lameCX = inv.lamecx || inv.lameCX || [];
  const lameStd = [...(inv.lameuxbx || inv.lameUXBX || [])];
  const assist = inv.assist || [];
  const ratchet = inv.ratchet || [];
  const bit = inv.bit || [];

  let html = "";
  if (tipo === 'cx') {
    html += `
      <label>Chip</label> <input id="sel-chip" placeholder="Nome Chip">
      <label>Lama CX</label> <select id="sel-lama">${lameCX.map(p => `<option value="${p}">${p}</option>`).join("")}</select>
      <label>Assist</label> <select id="sel-assist"><option value="">- Nessuno -</option>${assist.map(p => `<option value="${p}">${p}</option>`).join("")}</select>
    `;
  } else {
    html += `<label>Lama (UX/BX)</label> <select id="sel-lama">${lameStd.map(p => `<option value="${p}">${p}</option>`).join("")}</select>`;
  }
  html += `
    <label>Ratchet</label> <select id="sel-ratchet">${ratchet.map(p => `<option value="${p}">${p}</option>`).join("")}</select>
    <label>Bit</label> <select id="sel-bit">${bit.map(p => `<option value="${p}">${p}</option>`).join("")}</select>
  `;
  container.innerHTML = html;
};

function savecombo() {
  const tipo = document.getElementById("new-tipo").value;
  const nome = document.getElementById("new-nome").value;
  const lama = document.getElementById("sel-lama").value;
  const ratchet = document.getElementById("sel-ratchet").value;
  const bit = document.getElementById("sel-bit").value;

  if (!lama || !ratchet || !bit) { alert("Seleziona tutti i pezzi!"); return; }

  const newCombo = {
    tipo, nome: nome || (tipo === 'cx' ? "Combo CX" : "Combo UX/BX"),
    lama, ratchet, bit, wins: 0, losses: 0
  };
  if (tipo === 'cx') {
    newCombo.chip = document.getElementById("sel-chip").value || "Chip";
    newCombo.assist = document.getElementById("sel-assist").value || "";
  }

  const combos = storage.get("combos", defaultcombos);
  combos.push(newCombo);
  storage.set("combos", combos);
  closeOverlay();
  opencombo();
}

function editstats(index) {
  const combos = storage.get("combos", defaultcombos);
  const c = combos[index];
  window.updatestat = function(field, delta) {
    const el = document.getElementById(`val-${field}`);
    let val = parseInt(el.innerText) + delta;
    if(val < 0) val = 0;
    el.innerText = val;
  };
  openOverlay(`
    <h2>Statistiche</h2>
    <h3 style="color:#ff8c00;">${c.nome}</h3>
    <div style="display:flex; justify-content:space-around; margin:20px 0;">
      <div style="text-align:center;">
        <div style="color:#4caf50;">VITTORIE</div>
        <div style="display:flex; gap:10px; align-items:center;">
          <button class="secondary" onclick="updatestat('wins', -1)">-</button>
          <span id="val-wins" style="font-size:20px; width:30px;">${c.wins||0}</span>
          <button style="background:#4caf50;" onclick="updatestat('wins', 1)">+</button>
        </div>
      </div>
      <div style="text-align:center;">
        <div style="color:#f44336;">SCONFITTE</div>
        <div style="display:flex; gap:10px; align-items:center;">
          <button class="secondary" onclick="updatestat('losses', -1)">-</button>
          <span id="val-losses" style="font-size:20px; width:30px;">${c.losses||0}</span>
          <button style="background:#f44336;" onclick="updatestat('losses', 1)">+</button>
        </div>
      </div>
    </div>
    <div style="display:flex; gap:10px;">
      <button onclick="confirmstats(${index})">Salva</button>
      <button class="secondary" onclick="closeOverlay()">Annulla</button>
    </div>
  `);
}

function confirmstats(index) {
  const wins = parseInt(document.getElementById("val-wins").innerText);
  const losses = parseInt(document.getElementById("val-losses").innerText);
  const combos = storage.get("combos", defaultcombos);
  combos[index].wins = wins;
  combos[index].losses = losses;
  storage.set("combos", combos);
  closeOverlay();
  opencombo();
}

function deletecombo(index) {
  if(!confirm("Eliminare?")) return;
  const combos = storage.get("combos", defaultcombos);
  combos.splice(index, 1);
  storage.set("combos", combos);
  opencombo();
}

function filtercombo(q) {
  document.querySelectorAll(".combo-item").forEach(el => {
    const nome = el.getAttribute("data-name");
    el.style.display = nome.includes(q.toLowerCase()) ? "block" : "none";
  });
}
