const ideas = [
  "AI-powered habit tracker",
  "Anonymous micro-journal",
  "Local events discovery app",
  "Minimalist finance tracker",
  "Random challenge generator",
  "Ambient sound mixer",
  "Code snippet organizer",
  "Mood-based playlist generator",
  "Weekly reflection prompt app",
  "Collaborative sketching tool",
];

const names = [
  "Forge",
  "Pulse",
  "Kairos",
  "Atlas",
  "Nova",
  "Echo",
  "Prism",
  "Beacon",
  "Drift",
  "Tide",
];

const STORAGE_KEY = "ideaGenerator.history";
let searchTerm = "";

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function $(id) {
  return document.getElementById(id);
}

function animateResult(el) {
  el.classList.add("bounce");
  setTimeout(() => el.classList.remove("bounce"), 600);
}

function copyCurrent() {
  const ideaText = $("idea").textContent || "";
  const nameText = $("name").textContent || "";
  const text = [ideaText, nameText].filter(Boolean).join(" — ");

  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    const toast = $("toast");
    if (toast) {
      toast.textContent = "Copied to clipboard";
      toast.classList.add("show");
      clearTimeout(window.copyToastTimeout);
      window.copyToastTimeout = setTimeout(() => {
        toast.classList.remove("show");
      }, 1400);
    }
  });
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Failed to parse history from localStorage", e);
    return [];
  }
}

function saveHistory(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function renderHistory() {
  const history = loadHistory();
  const ul = $("historyList");
  ul.innerHTML = "";

  // Update count
  const countEl = $("historyCount");
  if (countEl) countEl.textContent = history.length;

  if (!history.length) {
    const li = document.createElement("li");
    li.textContent = "No saved ideas yet.";
    li.className = "history-empty";
    ul.appendChild(li);
    return;
  }

  let shown = 0;
  history
    .slice()
    .reverse()
    .forEach((entry, idx) => {
      const search = searchTerm.toLowerCase();
      const matches =
        !search ||
        entry.idea.toLowerCase().includes(search) ||
        (entry.name && entry.name.toLowerCase().includes(search));

      if (!matches) return;
      shown++;

      const li = document.createElement("li");
      li.className = "history-item";
      const ts = new Date(entry.ts).toLocaleString();
      const textDiv = document.createElement("div");
      textDiv.innerHTML = `<div class="history-meta">${ts}</div><div class="history-text"><strong>${entry.idea || ""}</strong>${entry.name ? ` — <em>${entry.name}</em>` : ""}</div>`;
      li.appendChild(textDiv);

      const copy = document.createElement("button");
      copy.className = "btn btn-secondary history-copy";
      copy.title = "Copy to clipboard";
      copy.innerHTML = "📋";
      copy.addEventListener("click", () => {
        const text = `${entry.idea}${entry.name ? " — " + entry.name : ""}`;
        navigator.clipboard.writeText(text).then(() => {
          copy.innerHTML = "✓";
          setTimeout(() => {
            copy.innerHTML = "📋";
          }, 1500);
        });
      });
      li.appendChild(copy);

      const del = document.createElement("button");
      del.className = "btn btn-secondary history-delete";
      del.textContent = "Delete";
      del.addEventListener("click", () => {
        const originalIndex = history.length - 1 - idx;
        history.splice(originalIndex, 1);
        saveHistory(history);
        renderHistory();
      });
      li.appendChild(del);
      ul.appendChild(li);
    });

  if (shown === 0 && searchTerm) {
    const li = document.createElement("li");
    li.textContent = 'No results for "' + searchTerm + '"';
    li.className = "history-empty";
    ul.appendChild(li);
  }
}

function saveCurrent() {
  const ideaText = $("idea").textContent || "";
  const nameText = $("name").textContent || "";
  const entry = { idea: ideaText, name: nameText, ts: Date.now() };
  const history = loadHistory();
  history.push(entry);
  saveHistory(history);
  renderHistory();
}

function clearHistory() {
  if (!confirm("Clear all saved ideas? This cannot be undone.")) return;
  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
}

function exportHistory() {
  const history = loadHistory();
  const blob = new Blob([JSON.stringify(history, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ideas.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importHistoryFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data)) throw new Error("Invalid file format");
      const history = loadHistory();
      // merge, avoid duplicates by simple timestamp check
      const merged = history.concat(data);
      saveHistory(merged);
      renderHistory();
      alert("Imported " + data.length + " items.");
    } catch (e) {
      alert("Failed to import: " + e.message);
    }
  };
  reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded", () => {
  renderHistory();

  $("ideaBtn").addEventListener("click", () => {
    $("idea").textContent = randomFrom(ideas);
    animateResult($("idea"));
  });

  $("nameBtn").addEventListener("click", () => {
    $("name").textContent = randomFrom(names);
    animateResult($("name"));
  });

  $("bothBtn").addEventListener("click", () => {
    $("idea").textContent = randomFrom(ideas);
    $("name").textContent = randomFrom(names);
    animateResult($("idea"));
    animateResult($("name"));
  });

  $("saveBtn")?.addEventListener("click", saveCurrent);
  $("clearBtn")?.addEventListener("click", clearHistory);
  $("exportBtn")?.addEventListener("click", exportHistory);
  $("copyBtn")?.addEventListener("click", copyCurrent);
  $("importInput")?.addEventListener("change", (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) importHistoryFile(f);
    e.target.value = "";
  });

  // Search input
  const searchInput = $("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchTerm = e.target.value;
      renderHistory();
    });
  }

  // Help modal
  const helpBtn = $("helpBtn");
  const helpModal = $("helpModal");
  const closeHelp = $("closeHelp");
  if (helpBtn && helpModal) {
    helpBtn.addEventListener("click", () => {
      helpModal.style.display = "block";
    });
    closeHelp?.addEventListener("click", () => {
      helpModal.style.display = "none";
    });
    window.addEventListener("click", (e) => {
      if (e.target === helpModal) {
        helpModal.style.display = "none";
      }
    });
  }

  // keyboard: Enter generates both
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.metaKey && !e.ctrlKey && !e.altKey) {
      // Don't trigger if in search input
      if (document.activeElement !== searchInput) {
        $("bothBtn").click();
      }
    }
    // ? for help
    if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
      const modal = $("helpModal");
      if (modal)
        modal.style.display = modal.style.display === "none" ? "block" : "none";
    }
  });
});
