/* ==========================================================================
   Ruokailukirjaus — prototyyppi (kuvitteellinen data)
   Renders into any element with id="ruokailu-app".
   ========================================================================== */

(function () {
  "use strict";

  var app = document.getElementById("ruokailu-app");
  if (!app) return;

  /* ---------- data ---------- */

  var RESIDENTS = [
    ["Aino V.", 12], ["Eino M.", 3], ["Helmi J.", 18], ["Toivo K.", 7],
    ["Lempi H.", 1], ["Väinö S.", 15], ["Siiri L.", 9], ["Armas P.", 20],
    ["Elsa N.", 5], ["Onni R.", 11], ["Aili T.", 2], ["Kalle O.", 14],
    ["Martta E.", 8], ["Urho A.", 17], ["Impi B.", 4], ["Paavo D.", 19],
    ["Hilja F.", 6], ["Veikko G.", 13], ["Saima I.", 10], ["Tauno Y.", 16]
  ];

  var MEALS = ["Aamupala", "Lounas", "Päivällinen", "Iltapala"];
  var STATES = { 1: "Ruokasali", 2: "Huoneessa", 3: "Ei osallistunut" };

  var state = {
    meal: 0,
    records: {},     // "meal_index" -> 1|2|3
    times: {},       // "meal_index" -> "HH:MM"
    notes: {},       // "meal_index" -> string
    openNote: null,  // resident index
    query: "",
    sort: "az"
  };

  /* ---------- helpers ---------- */

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function clock() {
    var d = new Date();
    return pad(d.getHours()) + ":" + pad(d.getMinutes());
  }

  function keyOf(meal, i) { return meal + "_" + i; }

  function recordOf(i) { return state.records[keyOf(state.meal, i)]; }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function sortIdx(list) {
    var copy = list.slice();
    copy.sort(function (a, b) {
      if (state.sort === "room") return RESIDENTS[a][1] - RESIDENTS[b][1];
      var r = RESIDENTS[a][0].localeCompare(RESIDENTS[b][0], "fi");
      return state.sort === "za" ? -r : r;
    });
    return copy;
  }

  function matches(i) {
    var q = state.query.trim().toLowerCase();
    if (!q) return true;
    return RESIDENTS[i][0].toLowerCase().indexOf(q) !== -1 ||
           String(RESIDENTS[i][1]) === q;
  }

  function counts() {
    var un = [], groups = { 1: [], 2: [], 3: [] };
    for (var i = 0; i < RESIDENTS.length; i++) {
      var s = recordOf(i);
      if (s) groups[s].push(i); else un.push(i);
    }
    return { un: un, groups: groups };
  }

  /* ---------- shell ---------- */

  app.innerHTML = [
    '<div class="rail">',
    '  <div class="rail-top">',
    '    <div>',
    '      <div class="rail-sub">Osasto 2 · Kotikallio</div>',
    '      <h3 class="rail-title">Ruokailukirjaus</h3>',
    '      <div class="rail-date">' + new Date().toLocaleDateString("fi-FI", { weekday: "short", day: "numeric", month: "numeric", year: "numeric" }) + '</div>',
    '    </div>',
    '    <div class="meals" id="app-meals" role="tablist" aria-label="Ateria"></div>',
    '    <div class="progress-block">',
    '      <div class="progress-line"><span id="app-done">0 / 20 kirjattu</span><span id="app-pct">0 %</span></div>',
    '      <div class="bar"><i id="app-bar"></i></div>',
    '    </div>',
    '    <div class="summary" id="app-summary"></div>',
    '  </div>',
    '  <div class="save-block">',
    '    <button type="button" class="save" id="app-save">Tallenna</button>',
    '    <div class="save-caption" id="app-caption"></div>',
    '  </div>',
    '</div>',
    '<div class="main">',
    '  <div class="toolbar">',
    '    <label class="search">',
    '      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="4.6" stroke="currentColor" stroke-width="1.5"/><path d="M10.6 10.6l3.2 3.2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    '      <input id="app-q" type="search" placeholder="Hae nimellä tai huoneella" aria-label="Hae asukasta nimellä tai huoneella" autocomplete="off">',
    '    </label>',
    '    <select class="sort" id="app-sort" aria-label="Lajittelu">',
    '      <option value="az">A → Ö</option>',
    '      <option value="za">Ö → A</option>',
    '      <option value="room">Huone</option>',
    '    </select>',
    '  </div>',
    '  <div id="app-list"></div>',
    '</div>'
  ].join("");

  var el = {
    meals: document.getElementById("app-meals"),
    done: document.getElementById("app-done"),
    pct: document.getElementById("app-pct"),
    bar: document.getElementById("app-bar"),
    summary: document.getElementById("app-summary"),
    save: document.getElementById("app-save"),
    caption: document.getElementById("app-caption"),
    q: document.getElementById("app-q"),
    sort: document.getElementById("app-sort"),
    list: document.getElementById("app-list")
  };

  /* ---------- renderers ---------- */

  function renderMeals() {
    el.meals.innerHTML = MEALS.map(function (name, m) {
      var done = 0;
      for (var i = 0; i < RESIDENTS.length; i++) {
        if (state.records[keyOf(m, i)]) done++;
      }
      return '<button type="button" class="meal" role="tab" aria-selected="' + (m === state.meal) +
        '" aria-current="' + (m === state.meal) + '" data-meal="' + m + '">' +
        '<span>' + name + '</span>' +
        '<span class="meal-count">' + done + "/20</span></button>";
    }).join("");
  }

  function renderProgress(c) {
    var total = RESIDENTS.length;
    var done = total - c.un.length;
    el.done.textContent = done + " / " + total + " kirjattu";
    el.pct.textContent = Math.round((done / total) * 100) + " %";
    el.bar.style.width = (done / total) * 100 + "%";
  }

  function renderSummary(c) {
    el.summary.innerHTML =
      '<div class="summary-row" data-s="pending"><span>Odottaa</span><b>' + c.un.length + '</b></div>' +
      '<div class="summary-row" data-s="1"><span>Ruokasali</span><b>' + c.groups[1].length + '</b></div>' +
      '<div class="summary-row" data-s="2"><span>Huoneessa</span><b>' + c.groups[2].length + '</b></div>' +
      '<div class="summary-row" data-s="3"><span>Ei osallistunut</span><b>' + c.groups[3].length + '</b></div>';
  }

  function renderSave(c) {
    var total = RESIDENTS.length;
    var done = total - c.un.length;
    el.save.disabled = done === 0;
    el.save.textContent = done === 0
      ? "Tallenna"
      : "Tallenna " + done + (done === 1 ? " kirjaus" : " kirjausta");
    el.caption.textContent = c.un.length === RESIDENTS.length
      ? "Merkitse asukkaat – jokainen napautus on oma kirjauksensa"
      : c.un.length
        ? c.un.length + " kirjaamatta – voit tallentaa myös myöhemmin"
        : "Kaikki kirjattu – tallennus luo " + RESIDENTS.length + " erillistä kirjausta";
  }

  function stateButtons(i) {
    var current = recordOf(i) || 0;
    return '<div class="state-btns" role="group" aria-label="Merkitse: ' + escapeHtml(RESIDENTS[i][0]) + '">' +
      [1, 2, 3].map(function (v) {
        return '<button type="button" class="state-btn" data-v="' + v + '" data-i="' + i +
          '" aria-pressed="' + (current === v) + '">' + STATES[v] + "</button>";
      }).join("") + "</div>";
  }

  function emptyRow(text) {
    return '<div class="empty">' + text + "</div>";
  }

  function renderList(c) {
    var html = [];

    /* group 0 — pending, always on top */
    html.push('<div class="group-bar" data-s="pending"><span>KIRJAAMATTA</span><span>' +
      (c.un.length ? c.un.length + " jäljellä" : "valmis") + "</span></div>");

    var pendingVisible = sortIdx(c.un.filter(matches));
    if (!c.un.length) {
      html.push(emptyRow("Kaikki kirjattu tälle aterialle."));
    } else if (!pendingVisible.length) {
      html.push(emptyRow("Ei hakutulosta kirjaamattomissa."));
    } else {
      html.push('<div class="list">');
      pendingVisible.forEach(function (i) {
        html.push(
          '<div class="row-pending">' +
            '<div class="who"><span>' + RESIDENTS[i][0] + '</span><small>huone ' + RESIDENTS[i][1] + "</small></div>" +
            stateButtons(i) +
          "</div>"
        );
      });
      html.push("</div>");
    }

    /* groups 1–3 */
    [1, 2, 3].forEach(function (s) {
      var members = sortIdx(c.groups[s].filter(matches));
      html.push('<div class="group-bar" data-s="' + s + '"><span>' + STATES[s].toUpperCase() +
        "</span><span>" + c.groups[s].length + "</span></div>");

      if (!c.groups[s].length) {
        html.push(emptyRow("Ei kirjauksia."));
        return;
      }
      if (!members.length) {
        html.push(emptyRow("Ei hakutulosta."));
        return;
      }

      html.push('<div class="list">');
      members.forEach(function (i) {
        var k = keyOf(state.meal, i);
        var noteCount = state.notes[k];
        html.push(
          '<button type="button" class="row-done" data-note="' + i + '" aria-expanded="' +
            (state.openNote === i) + '">' +
            '<span class="who"><span>' + RESIDENTS[i][0] + "</span><small>huone " + RESIDENTS[i][1] + "</small></span>" +
            '<span class="meta">' +
              (noteCount ? '<span class="note-mark" title="Huomautus">●</span>' : "") +
              '<span class="tag" data-s="' + s + '">' + STATES[s] + "</span>" +
              '<span class="time">' + (state.times[k] || "") + "</span>" +
            "</span>" +
          "</button>"
        );

        if (state.openNote === i) {
          html.push(
            '<div class="note-editor">' +
              stateButtons(i) +
              '<label for="note-' + i + '">HUOMAUTUS</label>' +
              '<input id="note-' + i + '" type="text" data-noteinput="' + i +
                '" value="' + escapeHtml(state.notes[k] || "") +
                '" placeholder="Ruokahalu, nielemisvaikeudet…">' +
              '<div class="note-hint">Sama nappi uudelleen = kirjaus perutaan.</div>' +
            "</div>"
          );
        }
      });
      html.push("</div>");
    });

    el.list.innerHTML = html.join("");
  }

  function renderAll() {
    var c = counts();
    renderMeals();
    renderProgress(c);
    renderSummary(c);
    renderSave(c);
    renderList(c);
  }

  /* ---------- events ---------- */

  el.meals.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-meal]");
    if (!btn) return;
    state.meal = Number(btn.dataset.meal);
    state.openNote = null;
    renderAll();
  });

  el.list.addEventListener("click", function (e) {
    var stateBtn = e.target.closest(".state-btn");
    if (stateBtn) {
      var i = Number(stateBtn.dataset.i);
      var v = Number(stateBtn.dataset.v);
      var k = keyOf(state.meal, i);
      if (state.records[k] === v) {
        delete state.records[k];
        delete state.times[k];
        state.openNote = null;
      } else {
        state.records[k] = v;
        state.times[k] = clock();
      }
      renderAll();
      return;
    }

    var doneRow = e.target.closest(".row-done");
    if (doneRow) {
      var idx = Number(doneRow.dataset.note);
      state.openNote = state.openNote === idx ? null : idx;
      renderList(counts());
    }
  });

  el.list.addEventListener("input", function (e) {
    var field = e.target.closest("[data-noteinput]");
    if (!field) return;
    var k = keyOf(state.meal, Number(field.dataset.noteinput));
    if (field.value.trim()) state.notes[k] = field.value;
    else delete state.notes[k];
  });

  el.q.addEventListener("input", function () {
    state.query = el.q.value;
    renderList(counts());
  });

  el.sort.addEventListener("change", function () {
    state.sort = el.sort.value;
    renderList(counts());
  });

  el.save.addEventListener("click", function () {
    var c = counts();
    var total = RESIDENTS.length;
    var done = total - c.un.length;
    showToast("Tallennettu: " + done + " kirjausta" +
      (c.un.length ? " · " + c.un.length + " vielä kirjaamatta" : " · ateria valmis"));
  });

  /* ---------- toast ---------- */

  var toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  document.body.appendChild(toast);
  var toastTimer;

  function showToast(msg) {
    toast.textContent = msg;
    toast.dataset.open = "true";
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.dataset.open = "false"; }, 2600);
  }

  /* ---------- go ---------- */

  renderAll();
})();
