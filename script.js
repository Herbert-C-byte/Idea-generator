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

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

document.getElementById("ideaBtn").addEventListener("click", () => {
  document.getElementById("idea").textContent = randomFrom(ideas);
});

document.getElementById("nameBtn").addEventListener("click", () => {
  document.getElementById("name").textContent = randomFrom(names);
  console.log("Name button clicked");
});
