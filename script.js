// ==================== Configuration ====================
const CONFIG = {
    satellites: {
        count: 6,
        minSpeed: 20,
        maxSpeed: 40,
        minSize: 0.6,
        maxSize: 1.2
    },
    shootingStars: {
        count: 15,
        minDuration: 2,
        maxDuration: 4
    },
    astronauts: {
        count: 2
    },
    rockets: {
        count: 1
    },
    planets: {
        count: 2
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

// ==================== Satellite Animation ====================
class SatelliteManager {
    constructor() {
        this.container = document.getElementById('fish-container');
        this.satellites = [];
        this.init();
    }

    init() {
        for (let i = 0; i < CONFIG.satellites.count; i++) {
            this.createSatellite();
        }
    }

    createSatellite() {
        const satellite = document.createElement('div');
        satellite.className = 'fish';
        
        // Random size
        const scale = CONFIG.satellites.minSize + Math.random() * (CONFIG.satellites.maxSize - CONFIG.satellites.minSize);
        
        // Random vertical position
        const yPosition = 10 + Math.random() * 70;
        
        // Random speed
        const duration = CONFIG.satellites.minSpeed + Math.random() * (CONFIG.satellites.maxSpeed - CONFIG.satellites.minSpeed);
        
        // Random vertical offset
        const swimOffset = -50 + Math.random() * 100;
        
        // Random delay
        const delay = Math.random() * 8;
        
        satellite.style.setProperty('--swim-offset', `${swimOffset}px`);
        satellite.style.top = `${yPosition}%`;
        satellite.style.transform = `scale(${scale})`;
        satellite.style.animation = `swim ${duration}s linear infinite`;
        satellite.style.animationDelay = `${delay}s`;
        
        // Create satellite body and antenna
        const body = document.createElement('div');
        body.className = 'fish-body';
        
        const antenna = document.createElement('div');
        antenna.className = 'fish-tail';
        
        satellite.appendChild(body);
        satellite.appendChild(antenna);
        
        this.container.appendChild(satellite);
        this.satellites.push(satellite);
        
        // Restart animation with new random values
        satellite.addEventListener('animationiteration', () => {
            const newYPosition = 10 + Math.random() * 70;
            const newSwimOffset = -50 + Math.random() * 100;
            const newDuration = CONFIG.satellites.minSpeed + Math.random() * (CONFIG.satellites.maxSpeed - CONFIG.satellites.minSpeed);
            
            satellite.style.setProperty('--swim-offset', `${newSwimOffset}px`);
            satellite.style.top = `${newYPosition}%`;
            satellite.style.animation = `swim ${newDuration}s linear infinite`;
        });
    }
}

// ==================== Shooting Star Animation ====================
class ShootingStarManager {
    constructor() {
        this.container = document.getElementById('bubble-container');
        this.stars = [];
        this.init();
    }

    init() {
        for (let i = 0; i < CONFIG.shootingStars.count; i++) {
            setTimeout(() => this.createShootingStar(), i * 800);
        }
    }

    createShootingStar() {
        const star = document.createElement('div');
        star.className = 'bubble';
        
        // Random horizontal start position
        const startX = Math.random() * 80;
        
        // Random duration
        const duration = CONFIG.shootingStars.minDuration + Math.random() * (CONFIG.shootingStars.maxDuration - CONFIG.shootingStars.minDuration);
        
        // Random delay
        const delay = Math.random() * 5;
        
        star.style.setProperty('--start-x', `${startX}%`);
        star.style.animation = `shooting-star ${duration}s linear infinite`;
        star.style.animationDelay = `${delay}s`;
        
        this.container.appendChild(star);
        this.stars.push(star);
        
        // Randomize next shooting star
        star.addEventListener('animationiteration', () => {
            const newStartX = Math.random() * 80;
            const newDuration = CONFIG.shootingStars.minDuration + Math.random() * (CONFIG.shootingStars.maxDuration - CONFIG.shootingStars.minDuration);
            
            star.style.setProperty('--start-x', `${newStartX}%`);
            star.style.animation = `shooting-star ${newDuration}s linear infinite`;
        });
    }
}

// ==================== Astronaut Manager ====================
class AstronautManager {
    constructor() {
        this.container = document.getElementById('fish-container');
        this.init();
    }

    init() {
        for (let i = 0; i < CONFIG.astronauts.count; i++) {
            this.createAstronaut(i);
        }
    }

    createAstronaut(index) {
        const astronaut = document.createElement('div');
        astronaut.className = 'astronaut';
        
        // Position astronauts
        const positions = [
            { top: '25%', left: '15%' },
            { top: '60%', right: '20%' }
        ];
        
        const pos = positions[index];
        Object.assign(astronaut.style, pos);
        
        // Add animation delay
        astronaut.style.animationDelay = `${index * 2}s`;
        
        astronaut.innerHTML = `
            <div class="astronaut-body">
                <div class="astronaut-helmet">
                    <div class="astronaut-visor"></div>
                </div>
                <div class="astronaut-arm left"></div>
                <div class="astronaut-arm right"></div>
                <div class="astronaut-leg left"></div>
                <div class="astronaut-leg right"></div>
            </div>
        `;
        
        this.container.appendChild(astronaut);
    }
}

// ==================== Rocket Manager ====================
class RocketManager {
    constructor() {
        this.container = document.getElementById('fish-container');
        this.init();
    }

    init() {
        for (let i = 0; i < CONFIG.rockets.count; i++) {
            setTimeout(() => this.createRocket(), i * 5000);
        }
    }

    createRocket() {
        const rocket = document.createElement('div');
        rocket.className = 'rocket';
        
        rocket.innerHTML = `
            <div class="rocket-body">
                <div class="rocket-nose"></div>
                <div class="rocket-window"></div>
                <div class="rocket-fin left"></div>
                <div class="rocket-fin right"></div>
                <div class="rocket-flame"></div>
            </div>
        `;
        
        this.container.appendChild(rocket);
        
        // Remove and recreate rocket after animation
        rocket.addEventListener('animationiteration', () => {
            setTimeout(() => {
                rocket.style.animation = 'none';
                setTimeout(() => {
                    rocket.style.animation = 'rocket-fly 15s linear infinite';
                }, 100);
            }, Math.random() * 10000);
        });
    }
}

// ==================== Planet Manager ====================
class PlanetManager {
    constructor() {
        this.container = document.getElementById('fish-container');
        this.init();
    }

    init() {
        for (let i = 0; i < CONFIG.planets.count; i++) {
            this.createPlanet(i);
        }
    }

    createPlanet(index) {
        const planet = document.createElement('div');
        planet.className = `planet planet-${index + 1}`;
        this.container.appendChild(planet);
    }
}

// ==================== Shortcut Manager ====================
class ShortcutManager {
    constructor() {
        this.container = document.getElementById('shortcuts-grid');
        this.modal = document.getElementById('add-shortcut-modal');
        this.form = document.getElementById('shortcut-form');
        this.addBtn = document.getElementById('add-shortcut-btn');
        this.cancelBtn = document.getElementById('cancel-btn');
        
        this.shortcuts = this.loadShortcuts();
        this.init();
    }

    init() {
        this.renderShortcuts();
        this.attachEventListeners();
    }

    loadShortcuts() {
        const saved = localStorage.getItem('shortcuts');
        return saved ? JSON.parse(saved) : CONFIG.defaultShortcuts;
    }

    saveShortcuts() {
        localStorage.setItem('shortcuts', JSON.stringify(this.shortcuts));
    }

    renderShortcuts() {
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

        // Attach delete handlers
        document.querySelectorAll('.shortcut-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.deleteShortcut(parseInt(btn.dataset.index));
            });
        });
    }

    addShortcut(name, url, icon) {
        // Ensure URL has protocol
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        this.shortcuts.push({ name, url, icon });
        this.saveShortcuts();
        this.renderShortcuts();
    }

    deleteShortcut(index) {
        if (confirm('Are you sure you want to delete this shortcut?')) {
            this.shortcuts.splice(index, 1);
            this.saveShortcuts();
            this.renderShortcuts();
        }
    }

    attachEventListeners() {
        // Open modal
        this.addBtn.addEventListener('click', () => {
            this.modal.classList.add('active');
            document.getElementById('shortcut-name').focus();
        });

        // Close modal
        this.cancelBtn.addEventListener('click', () => {
            this.modal.classList.remove('active');
            this.form.reset();
        });

        // Close modal on background click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.modal.classList.remove('active');
                this.form.reset();
            }
        });

        // Submit form
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('shortcut-name').value.trim();
            const url = document.getElementById('shortcut-url').value.trim();
            const icon = document.getElementById('shortcut-icon').value.trim();
            
            if (name && url && icon) {
                this.addShortcut(name, url, icon);
                this.modal.classList.remove('active');
                this.form.reset();
            }
        });
    }
}

// ==================== Search Functionality ====================
class SearchManager {
    constructor() {
        this.input = document.getElementById('search-input');
        this.init();
    }

    init() {
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
    }

    performSearch() {
        const query = this.input.value.trim();
        
        if (!query) return;
        
        // Check if input is a URL
        if (this.isURL(query)) {
            window.location.href = query.startsWith('http') ? query : 'https://' + query;
        } else {
            // Perform Google search
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
    }

    isURL(string) {
        // Simple URL detection
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        return urlPattern.test(string) || string.includes('.');
    }
}

// ==================== Initialize Everything ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    new SatelliteManager();
    new ShootingStarManager();
    new AstronautManager();
    new RocketManager();
    new PlanetManager();
    new ShortcutManager();
    new SearchManager();
    
    console.log('🚀 Space Browser Home Screen Loaded!');
});

// ==================== Keyboard Shortcuts ====================
document.addEventListener('keydown', (e) => {
    // Focus search bar with '/' key
    if (e.key === '/' && document.activeElement !== document.getElementById('search-input')) {
        e.preventDefault();
        document.getElementById('search-input').focus();
    }
    
    // Escape to blur search or close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('add-shortcut-modal');
        if (modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.getElementById('shortcut-form').reset();
        } else {
            document.getElementById('search-input').blur();
        }
    }
});