// -------------------- Clock --------------------
const clockEl = document.getElementById("clock");

function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  clockEl.textContent = `${hours}:${minutes}:${seconds}`;
}

updateClock();
setInterval(updateClock, 1000);

// -------------------- Search --------------------
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const SEARCH_URL = "https://www.google.com/search?q=";

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;
  const redirectUrl = `${SEARCH_URL}${encodeURIComponent(query)}`;
  window.location.href = redirectUrl;
});

// -------------------- Shortcuts --------------------
const shortcutGrid = document.getElementById("shortcutGrid");
const shortcutForm = document.getElementById("shortcutForm");
const toggleShortcutFormBtn = document.getElementById("toggleShortcutForm");
const shortcutNameInput = document.getElementById("shortcutName");
const shortcutUrlInput = document.getElementById("shortcutUrl");

const STORAGE_KEY = "aquaHome.shortcuts";
const defaultShortcuts = [
  { name: "CourseWeb", url: "https://courseweb.sliit.lk" },
  { name: "ChatGPT", url: "https://chat.openai.com" },
  { name: "DeepSeek", url: "https://www.deepseek.com" },
  { name: "MGX AI", url: "https://mgx.ai" },
];

const getShortcuts = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (_) {
      /* fall through to defaults */
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultShortcuts));
  return [...defaultShortcuts];
};

const saveShortcuts = (shortcuts) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts));
};

const renderShortcuts = () => {
  const shortcuts = getShortcuts();
  shortcutGrid.innerHTML = "";

  shortcuts.forEach((shortcut, index) => {
    const tile = document.createElement("a");
    tile.className = "shortcut-tile";
    tile.href = shortcut.url;
    tile.target = "_blank";
    tile.rel = "noopener noreferrer";
    tile.role = "listitem";

    const title = document.createElement("div");
    title.className = "shortcut-title";
    title.textContent = shortcut.name;

    const url = document.createElement("div");
    url.className = "shortcut-url";
    url.textContent = shortcut.url.replace(/^https?:\/\//i, "");

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "shortcut-remove";
    removeBtn.textContent = "×";
    removeBtn.title = "Remove shortcut";

    removeBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const updated = getShortcuts().filter((_, i) => i !== index);
      saveShortcuts(updated);
      renderShortcuts();
    });

    tile.append(title, url, removeBtn);
    shortcutGrid.appendChild(tile);
  });
};

toggleShortcutFormBtn.addEventListener("click", () => {
  const isHidden = shortcutForm.hasAttribute("hidden");
  if (isHidden) {
    shortcutForm.removeAttribute("hidden");
    shortcutNameInput.focus();
  } else {
    shortcutForm.setAttribute("hidden", "");
  }
  toggleShortcutFormBtn.setAttribute("aria-expanded", String(isHidden));
});

shortcutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = shortcutNameInput.value.trim();
  let url = shortcutUrlInput.value.trim();

  if (!name || !url) {
    alert("Please provide both a label and a URL.");
    return;
  }

  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  const shortcuts = getShortcuts();
  shortcuts.push({ name, url });
  saveShortcuts(shortcuts);

  shortcutNameInput.value = "";
  shortcutUrlInput.value = "";
  shortcutNameInput.focus();

  renderShortcuts();
});

renderShortcuts();

// -------------------- Fish Tank Animation --------------------
const fishLayer = document.getElementById("fishLayer");

const fishConfig = {
  count: 12,
  palettes: [
    { primary: "#7af0ff", secondary: "#1fd2ff" },
    { primary: "#ffc07f", secondary: "#ff8f70" },
    { primary: "#ff9dd4", secondary: "#ff60b8" },
    { primary: "#9f8bff", secondary: "#6c5ce7" },
    { primary: "#88ffda", secondary: "#35d6b6" },
    { primary: "#f7f48b", secondary: "#f9a620" },
  ],
  sizeRange: [70, 140],
  swimDurationRange: [20, 34],
  floatDurationRange: [6, 10],
  depthRange: [15, 75], // vh
  waveRange: [3, 10], // vh
};

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const createFishElement = () => {
  const fish = document.createElement("div");
  fish.className = "fish";

  const direction = Math.random() > 0.5 ? "swim-right" : "swim-left";
  fish.classList.add(direction);

  const palette = fishConfig.palettes[Math.floor(Math.random() * fishConfig.palettes.length)];
  const size = randomBetween(...fishConfig.sizeRange);
  const swimDuration = randomBetween(...fishConfig.swimDurationRange);
  const floatDuration = randomBetween(...fishConfig.floatDurationRange);
  const depth = randomBetween(...fishConfig.depthRange);
  const waveMagnitude = randomBetween(...fishConfig.waveRange);
  const waveDirection = Math.random() > 0.5 ? 1 : -1;

  fish.style.setProperty("--fish-color", palette.primary);
  fish.style.setProperty("--fish-secondary", palette.secondary);
  fish.style.setProperty("--fish-size", `${size}px`);
  fish.style.setProperty("--swim-duration", `${swimDuration}s`);
  fish.style.setProperty("--float-duration", `${floatDuration}s`);
  fish.style.setProperty("--fish-depth", `${depth}vh`);
  fish.style.setProperty("--wave", `${waveMagnitude * waveDirection}vh`);

  const fishInner = document.createElement("div");
  fishInner.className = "fish-inner";

  const tail = document.createElement("div");
  tail.className = "fish-tail";

  const body = document.createElement("div");
  body.className = "fish-body";

  const gill = document.createElement("div");
  gill.className = "fish-gill";

  const dorsalFin = document.createElement("div");
  dorsalFin.className = "fish-fin fish-fin--dorsal";

  const ventralFin = document.createElement("div");
  ventralFin.className = "fish-fin fish-fin--ventral";

  const eye = document.createElement("div");
  eye.className = "fish-eye";

  const highlight = document.createElement("div");
  highlight.className = "fish-highlight";

  const shadow = document.createElement("div");
  shadow.className = "fish-shadow";

  fishInner.append(tail, body, gill, dorsalFin, ventralFin, eye, highlight, shadow);
  fish.appendChild(fishInner);

  fish.addEventListener("animationiteration", () => {
    const newDepth = randomBetween(...fishConfig.depthRange);
    const newWave = randomBetween(...fishConfig.waveRange) * (Math.random() > 0.5 ? 1 : -1);
    fish.style.setProperty("--fish-depth", `${newDepth}vh`);
    fish.style.setProperty("--wave", `${newWave}vh`);
  });

  fish.addEventListener("mouseenter", () => {
    fish.style.setProperty("--swim-duration", `${Math.max(swimDuration * 0.7, 14)}s`);
  });

  fish.addEventListener("mouseleave", () => {
    fish.style.setProperty("--swim-duration", `${swimDuration}s`);
  });

  return fish;
};

const populateFish = () => {
  fishLayer.innerHTML = "";
  for (let i = 0; i < fishConfig.count; i += 1) {
    fishLayer.appendChild(createFishElement());
  }
};

populateFish();

window.addEventListener("resize", () => {
  // Slight delay to avoid excessive reflows while resizing
  window.requestAnimationFrame(() => {
    populateFish();
  });
});
