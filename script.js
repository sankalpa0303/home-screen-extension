// ==================== Configuration ====================
const CONFIG = {
    search: {
        recentLimit: 6,
        storageKey: 'recentSearches'
    },
    shortcuts: {
        storageKey: 'shortcuts'
    },
    background: {
        particleCount: 42,
        cometCount: 4
    },
    defaultShortcuts: [
        { name: 'CourseWeb', url: 'https://courseweb.com', icon: '📚' },
        { name: 'ChatGPT', url: 'https://chat.openai.com', icon: '🤖' },
        { name: 'DeepSeek', url: 'https://chat.deepseek.com', icon: '🔍' },
        { name: 'MGX AI', url: 'https://mgx.dev', icon: '✨' },
        { name: 'GitHub', url: 'https://github.com', icon: '🐙' },
        { name: 'YouTube', url: 'https://youtube.com', icon: '▶️' }
    ]
};

// ==================== Shortcut Manager ====================
class ShortcutManager {
    constructor() {
        this.container = document.getElementById('shortcuts-grid');
        this.modal = document.getElementById('add-shortcut-modal');
        this.form = document.getElementById('shortcut-form');
        this.addBtn = document.getElementById('add-shortcut-btn');
        this.cancelBtn = document.getElementById('cancel-btn');
        this.shortcuts = this.load();

        if (!this.container || !this.modal || !this.form) return;

        this.render();
        this.bindEvents();
    }

    load() {
        const saved = localStorage.getItem(CONFIG.shortcuts.storageKey);
        return saved ? JSON.parse(saved) : CONFIG.defaultShortcuts.slice();
    }

    save() {
        localStorage.setItem(CONFIG.shortcuts.storageKey, JSON.stringify(this.shortcuts));
    }

    render() {
        this.container.innerHTML = '';
        this.shortcuts.forEach((shortcut, index) => {
            const shortcutEl = document.createElement('a');
            shortcutEl.className = 'shortcut';
            shortcutEl.href = shortcut.url;
            shortcutEl.target = '_blank';
            shortcutEl.rel = 'noopener noreferrer';
            shortcutEl.innerHTML = `
                <div class="shortcut-icon">${shortcut.icon}</div>
                <div class="shortcut-name">${shortcut.name}</div>
                <button class="shortcut-delete" data-index="${index}" title="Delete shortcut">×</button>
            `;
            this.container.appendChild(shortcutEl);
        });

        this.container.querySelectorAll('.shortcut-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.remove(parseInt(btn.dataset.index, 10));
            });
        });
    }

    add(name, url, icon) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = `https://${url}`;
        }
        this.shortcuts.push({ name, url, icon });
        this.save();
        this.render();
    }

    remove(index) {
        this.shortcuts.splice(index, 1);
        this.save();
        this.render();
    }

    openModal() {
        this.modal.classList.add('active');
        document.getElementById('shortcut-name')?.focus();
    }

    closeModal() {
        this.modal.classList.remove('active');
        this.form.reset();
    }

    bindEvents() {
        this.addBtn?.addEventListener('click', () => this.openModal());
        this.cancelBtn?.addEventListener('click', () => this.closeModal());

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('shortcut-name')?.value.trim();
            const url = document.getElementById('shortcut-url')?.value.trim();
            const icon = document.getElementById('shortcut-icon')?.value.trim() || '🔗';

            if (name && url) {
                this.add(name, url, icon);
                this.closeModal();
            }
        });
    }
}

// ==================== Search Functionality ====================
class SearchManager {
    constructor() {
        this.input = document.getElementById('search-input');
        this.suggestions = document.getElementById('search-suggestions');
        this.recentList = document.getElementById('recent-searches');
        this.container = document.querySelector('.search-container');
        this.recents = this.load();

        if (!this.input || !this.suggestions || !this.recentList || !this.container) return;

        this.render();
        this.bindEvents();
    }

    load() {
        const saved = localStorage.getItem(CONFIG.search.storageKey);
        return saved ? JSON.parse(saved) : [];
    }

    save() {
        localStorage.setItem(CONFIG.search.storageKey, JSON.stringify(this.recents));
    }

    addRecent(query) {
        const normalized = query.toLowerCase();
        this.recents = this.recents.filter(item => item.toLowerCase() !== normalized);
        this.recents.unshift(query);
        if (this.recents.length > CONFIG.search.recentLimit) {
            this.recents = this.recents.slice(0, CONFIG.search.recentLimit);
        }
        this.save();
        this.render();
    }

    render() {
        this.recentList.innerHTML = '';
        if (this.recents.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'suggestion-empty';
            empty.textContent = 'Your latest searches will appear here.';
            this.recentList.appendChild(empty);
            return;
        }

        this.recents.forEach(term => {
            const item = document.createElement('li');
            item.className = 'suggestion-item';
            item.innerHTML = `
                <span class="suggestion-chip recent">Recent</span>
                <span class="suggestion-text">${term}</span>
            `;
            item.addEventListener('click', () => this.performSearch(term));
            this.recentList.appendChild(item);
        });
    }

    bindEvents() {
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        this.input.addEventListener('focus', () => this.showSuggestions());
        this.input.addEventListener('input', () => this.showSuggestions());

        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.hideSuggestions();
            }
        });
    }

    showSuggestions() {
        this.suggestions.classList.add('active');
    }

    hideSuggestions() {
        this.suggestions.classList.remove('active');
    }

    performSearch(override) {
        const query = (override ?? this.input.value).trim();
        if (!query) return;

        this.addRecent(query);
        this.hideSuggestions();
        this.input.value = '';

        if (this.isUrl(query)) {
            const target = query.startsWith('http') ? query : `https://${query}`;
            window.location.href = target;
        } else {
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
    }

    isUrl(value) {
        const pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?$/;
        return pattern.test(value);
    }
}

// ==================== Initialize Everything ====================
document.addEventListener('DOMContentLoaded', () => {
    window.shortcutManager = new ShortcutManager();
    window.searchManager = new SearchManager();
    initParticleField();
    initCometField();
});

// ==================== Keyboard Shortcuts ====================
document.addEventListener('keydown', (e) => {
    const searchInput = document.getElementById('search-input');

    if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput?.focus();
    }

    if (e.key === 'Escape') {
        const modal = document.getElementById('add-shortcut-modal');
        if (modal?.classList.contains('active')) {
            modal.classList.remove('active');
            document.getElementById('shortcut-form')?.reset();
            return;
        }

        if (document.activeElement === searchInput) {
            searchInput.blur();
        }

        document.getElementById('search-suggestions')?.classList.remove('active');
    }
});

// ==================== Background Particle Field ====================
function initParticleField() {
    const container = document.getElementById('data-particles');

    if (!container) return;

    container.innerHTML = '';
    const count = CONFIG.background?.particleCount ?? 40;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('span');
        particle.className = 'data-particle';

        const size = (Math.random() * 6 + 2).toFixed(1);
        particle.style.setProperty('--size', `${size}px`);
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.setProperty('--drift-x', `${(Math.random() * 60 - 30).toFixed(1)}px`);
        particle.style.setProperty('--drift-y', `${(Math.random() * 40 - 20).toFixed(1)}px`);
        particle.style.setProperty('--duration', `${(10 + Math.random() * 12).toFixed(1)}s`);
        particle.style.setProperty('--delay', `${(-Math.random() * 15).toFixed(1)}s`);

        fragment.appendChild(particle);
    }

    container.appendChild(fragment);
}

// ==================== Comet Field ====================
function initCometField() {
    const layer = document.getElementById('comet-layer');
    if (!layer) return;

    layer.innerHTML = '';
    const total = CONFIG.background?.cometCount ?? 4;

    for (let i = 0; i < total; i++) {
        const comet = document.createElement('div');
        comet.className = 'comet';
        comet.innerHTML = `
            <span class="comet-core"></span>
            <span class="comet-tail"></span>
        `;

        layer.appendChild(comet);
        launchComet(comet);
    }
}

function launchComet(comet) {
    const start = randomEdgePoint();
    positionCometImmediately(comet, start);
    comet.dataset.prevX = start.x;
    comet.dataset.prevY = start.y;

    setTimeout(() => driftComet(comet), 100 + Math.random() * 500);
}

function driftComet(comet) {
    const prevX = parseFloat(comet.dataset.prevX ?? 0);
    const prevY = parseFloat(comet.dataset.prevY ?? 0);

    let target = randomEdgePoint();
    let guard = 0;
    while (distanceTooShort(prevX, prevY, target.x, target.y) && guard < 5) {
        target = randomEdgePoint();
        guard++;
    }

    const duration = 6 + Math.random() * 6;
    const angle = Math.atan2(target.y - prevY, target.x - prevX) * (180 / Math.PI);

    comet.style.setProperty('--comet-duration', `${duration}s`);
    comet.style.transform = `rotate(${angle}deg) scale(${0.8 + Math.random() * 0.4})`;
    comet.style.left = `${target.x}%`;
    comet.style.top = `${target.y}%`;

    comet.dataset.prevX = target.x;
    comet.dataset.prevY = target.y;

    setTimeout(() => driftComet(comet), duration * 1000);
}

function positionCometImmediately(comet, point) {
    comet.style.transition = 'none';
    comet.style.left = `${point.x}%`;
    comet.style.top = `${point.y}%`;
    // Force reflow so the transition reset takes effect
    void comet.offsetHeight;
    comet.style.transition = '';
}

function randomEdgePoint() {
    const edge = Math.floor(Math.random() * 4);
    switch (edge) {
        case 0: // left
            return { x: -10, y: Math.random() * 100 };
        case 1: // right
            return { x: 110, y: Math.random() * 100 };
        case 2: // top
            return { x: Math.random() * 100, y: -10 };
        default: // bottom
            return { x: Math.random() * 100, y: 120 };
    }
}

function distanceTooShort(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy) < 40;
}