// -------------------- Clock --------------------
function updateClock() {
  const clock = document.getElementById("clock");
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  clock.textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock();

// -------------------- Dark/Light Mode --------------------
const toggleThemeBtn = document.getElementById("toggleTheme");
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

// -------------------- Search --------------------
const searchInput = document.getElementById("search");
searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const query = this.value.trim();
    if (query !== "") {
      window.location.href = "https://www.google.com/search?q=" + encodeURIComponent(query);
    }
  }
});

// -------------------- Shortcuts --------------------
const shortcutsContainer = document.getElementById("shortcuts");
const addShortcutBtn = document.getElementById("addShortcut");

function loadShortcuts() {
  const shortcuts = JSON.parse(localStorage.getItem("shortcuts") || "[]");
  shortcutsContainer.innerHTML = "";
  shortcuts.forEach((s, index) => {
    const a = document.createElement("a");
    a.textContent = s.name;
    a.href = s.url;
    a.target = "_blank";
    a.className = "shortcut";

    // Right-click to remove
    a.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      shortcuts.splice(index, 1);
      localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
      loadShortcuts();
    });

    shortcutsContainer.appendChild(a);
  });
}

addShortcutBtn.addEventListener("click", () => {
  const name = document.getElementById("shortcutName").value.trim();
  let url = document.getElementById("shortcutUrl").value.trim();
  if (!name || !url) return alert("Both fields are required!");
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;

  const shortcuts = JSON.parse(localStorage.getItem("shortcuts") || "[]");
  shortcuts.push({ name, url });
  localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
  document.getElementById("shortcutName").value = "";
  document.getElementById("shortcutUrl").value = "";
  loadShortcuts();
});

// Initial load
loadShortcuts();
