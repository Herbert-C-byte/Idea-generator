const ideas = [
  "AI-powered habit tracker",
  "Anonymous micro-journal",
  "Local events discovery app",
  "Minimalist finance tracker",
  "Random challenge generator",
  "Smart grocery list optimizer",
  "Pomodoro music mixer",
  "Code snippet organizer",
  "Mindfulness app for gamers",
  "Local skill exchange platform"
];

const names = [
  "Forge",
  "Pulse",
  "Kairos",
  "Atlas",
  "Nova",
  "Echo",
  "Verve",
  "Zenith",
  "Spark",
  "Helix"
];

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function updateResult(elementId, value) {
  const element = document.getElementById(elementId);
  element.style.opacity = "0.5";
  
  setTimeout(() => {
    element.textContent = value;
    element.style.opacity = "1";
  }, 200);
}

const ideaBtn = document.getElementById("ideaBtn");
const nameBtn = document.getElementById("nameBtn");
const bothBtn = document.getElementById("bothBtn");

ideaBtn.addEventListener("click", () => {
  updateResult("idea", randomFrom(ideas));
});

nameBtn.addEventListener("click", () => {
  updateResult("name", randomFrom(names));
});

bothBtn.addEventListener("click", () => {
  updateResult("idea", randomFrom(ideas));
  updateResult("name", randomFrom(names));
});

// Allow Enter key to generate ideas
document.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    bothBtn.click();
  }
});
