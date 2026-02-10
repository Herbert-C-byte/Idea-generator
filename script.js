const ideas = [
  "AI-powered habit tracker",
  "Anonymous micro-journal",
  "Local events discovery app",
  "Minimalist finance tracker",
  "Random challenge generator"
];

const names = [
  "Forge",
  "Pulse",
  "Kairos",
  "Atlas",
  "Nova",
  "Echo"
];

const STORAGE_KEY = "ideaGenerator.history";

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function $(id) { return document.getElementById(id); }

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('Failed to parse history from localStorage', e);
    return [];
  }
}

function saveHistory(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function renderHistory() {
  const history = loadHistory();
  const ul = $('historyList');
  ul.innerHTML = '';
  if (!history.length) {
    const li = document.createElement('li');
    li.textContent = 'No saved ideas yet.';
    li.className = 'history-empty';
    ul.appendChild(li);
    return;
  }

  history.slice().reverse().forEach((entry, idx) => {
    const li = document.createElement('li');
    li.className = 'history-item';
    const ts = new Date(entry.ts).toLocaleString();
    li.innerHTML = `<div class="history-meta">${ts}</div><div class="history-text"><strong>${entry.idea || ''}</strong>${entry.name?` — <em>${entry.name}</em>`:''}</div>`;
    const del = document.createElement('button');
    del.className = 'btn btn-secondary history-delete';
    del.textContent = 'Delete';
    del.addEventListener('click', () => {
      const originalIndex = history.length - 1 - idx;
      history.splice(originalIndex, 1);
      saveHistory(history);
      renderHistory();
    });
    li.appendChild(del);
    ul.appendChild(li);
  });
}

function saveCurrent() {
  const ideaText = $('idea').textContent || '';
  const nameText = $('name').textContent || '';
  const entry = { idea: ideaText, name: nameText, ts: Date.now() };
  const history = loadHistory();
  history.push(entry);
  saveHistory(history);
  renderHistory();
}

function clearHistory() {
  if (!confirm('Clear all saved ideas? This cannot be undone.')) return;
  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
}

function exportHistory() {
  const history = loadHistory();
  const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ideas.json';
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
      if (!Array.isArray(data)) throw new Error('Invalid file format');
      const history = loadHistory();
      // merge, avoid duplicates by simple timestamp check
      const merged = history.concat(data);
      saveHistory(merged);
      renderHistory();
      alert('Imported ' + data.length + ' items.');
    } catch (e) {
      alert('Failed to import: ' + e.message);
    }
  };
  reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', () => {
  renderHistory();

  $('ideaBtn').addEventListener('click', () => {
    $('idea').textContent = randomFrom(ideas);
  });

  $('nameBtn').addEventListener('click', () => {
    $('name').textContent = randomFrom(names);
  });

  $('bothBtn').addEventListener('click', () => {
    $('idea').textContent = randomFrom(ideas);
    $('name').textContent = randomFrom(names);
  });

  $('saveBtn')?.addEventListener('click', saveCurrent);
  $('clearBtn')?.addEventListener('click', clearHistory);
  $('exportBtn')?.addEventListener('click', exportHistory);
  $('importInput')?.addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) importHistoryFile(f);
    e.target.value = '';
  });

  // keyboard: Enter generates both
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      $('bothBtn').click();
    }
  });
});
