/* =========================================================
   Nadiah Albinali — Portfolio Script

   Features:
   1. Dark / light theme toggle (saved in localStorage)
   2. Personalized greeting and saved visitor name
   3. Smooth scrolling + mobile nav toggle
   4. Contact form validation
   5. Live Omnia project card from GitHub (1-hour cache, fallback on error)
   6. Project category/level filters and sorting (choices saved)
   7. Time-on-site timer
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  renderGreeting();
  initNameForm();
  initMobileNav();
  initContactForm();
  initFooterYear();
  initProjectControls();
  initGitHubCard();
  initVisitTimer();
});

/* ---------- 1. Theme toggle ---------- */

function initThemeToggle() {
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');

  // Respect a saved preference, otherwise use the system preference.
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = saved || (prefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  toggleBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';

    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      icon.textContent = '☀️';
    } else {
      root.removeAttribute('data-theme');
      icon.textContent = '🌙';
    }
  }
}

/* ---------- 2. Greeting (time of day + saved visitor name) ---------- */

const NAME_KEY = 'visitorName';

// Returns the time-based part of the greeting.
function getTimeGreeting() {
  const hour = new Date().getHours();

  if (hour < 5) return 'Welcome, night owl';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Writes the greeting, adding the visitor's name if one is saved.
function renderGreeting() {
  const greetingEl = document.getElementById('greeting');
  if (!greetingEl) return;

  const name = localStorage.getItem(NAME_KEY);
  const timeGreeting = getTimeGreeting();

  greetingEl.textContent = name
    ? `${timeGreeting}, ${name}! Welcome to my portfolio.`
    : `${timeGreeting}! Welcome to my portfolio.`;

  playFadeIn(greetingEl);
}

// Restarts the fade-in animation on an element.
function playFadeIn(el) {
  el.classList.remove('fade-in');
  void el.offsetWidth; // Force the browser to notice the removal.
  el.classList.add('fade-in');
}

/* ---------- 2b. Name form (first-time visitors) ---------- */

function initNameForm() {
  const form = document.getElementById('name-form');
  const input = document.getElementById('visitor-name');
  const errorEl = document.getElementById('visitor-name-error');
  const changeBtn = document.getElementById('change-name');

  if (!form || !input || !errorEl || !changeBtn) return;

  updateNameUI();

  // Handles clicking Save and pressing Enter in the input.
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = input.value.trim();

    if (name === '') {
      showError('You haven’t entered a name yet. Please type your name and click Save.');
      return;
    }

    localStorage.setItem(NAME_KEY, name);
    clearError();
    updateNameUI();
    renderGreeting();
  });

  changeBtn.addEventListener('click', () => {
    localStorage.removeItem(NAME_KEY);
    input.value = '';
    clearError();
    updateNameUI();
    renderGreeting();
    input.focus();
  });

  // Shows the form or the "Change name" button, depending on whether a name is saved.
  function updateNameUI() {
    const hasName = Boolean(localStorage.getItem(NAME_KEY));
    form.hidden = hasName;
    changeBtn.hidden = !hasName;
  }

  function showError(message) {
    errorEl.textContent = message;
    input.classList.add('invalid');
    playFadeIn(errorEl);
  }

  function clearError() {
    errorEl.textContent = '';
    input.classList.remove('invalid');
  }
}

/* ---------- 3. Mobile nav toggle + smooth scroll close ---------- */

function initMobileNav() {
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close the mobile menu after a link is clicked.
  // Smooth scrolling is handled by CSS and the anchor links.
  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- 4. Contact form validation ---------- */

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const successMsg = document.getElementById('form-success');

  // Each field has a validity rule and separate empty/invalid messages.
  const fields = [
    {
      input: nameInput,
      isValid: (value) => value.length >= 2,
      emptyMsg: 'Please enter your name.',
      invalidMsg: 'Your name needs at least 2 characters.',
    },
    {
      input: emailInput,
      isValid: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      emptyMsg: 'Please enter your email address.',
      invalidMsg: 'That email looks incomplete. Try something like name@example.com.',
    },
    {
      input: messageInput,
      isValid: (value) => value.length >= 10,
      emptyMsg: 'Please write a message before sending.',
      invalidMsg: 'Your message is a bit short. Please write at least 10 characters.',
    },
  ];

  // Clear a field's error as soon as the visitor starts fixing it.
  fields.forEach(({ input }) => {
    input.addEventListener('input', () => clearFieldError(input));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.textContent = '';

    const results = fields.map(validateField);
    const firstInvalid = fields.find((field, index) => !results[index]);

    if (firstInvalid) {
      firstInvalid.input.focus();
      return;
    }

    const name = nameInput.value.trim();
    successMsg.textContent =
      `Thanks, ${name}! Your message has been received. (This demo form isn’t connected to email yet.)`;
    playFadeIn(successMsg);
    form.reset();
  });

  // Checks one field and shows the appropriate message.
  function validateField({ input, isValid, emptyMsg, invalidMsg }) {
    const value = input.value.trim();
    let message = '';

    if (value === '') {
      message = emptyMsg;
    } else if (!isValid(value)) {
      message = invalidMsg;
    }

    const errorEl = document.getElementById(`${input.id}-error`);
    input.classList.toggle('invalid', message !== '');
    errorEl.textContent = message;

    if (message) playFadeIn(errorEl);

    return message === '';
  }

  function clearFieldError(input) {
    input.classList.remove('invalid');
    document.getElementById(`${input.id}-error`).textContent = '';
  }
}

/* ---------- Footer year ---------- */

function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------- 5. Live Omnia project card from GitHub (1-hour cache, fallback on error) ---------- */

const GITHUB_REPO_URL = 'https://api.github.com/repos/nhlsu/Omnia';
const REPO_CACHE_KEY = 'omniaRepoCache';
const CACHE_MAX_AGE = 60 * 60 * 1000; // Keep cached data for one hour.

async function initGitHubCard() {
  const card = document.getElementById('omnia-card');
  if (!card) return;

  // Step 1: Show the saved repo data if it is still less than an hour old.
  const cached = readRepoCache();
  if (cached) {
    renderRepo(card, cached);
    return;
  }

  // Step 2: No fresh saved data is available, so request it from GitHub.
  try {
    const response = await fetch(GITHUB_REPO_URL);

    if (!response.ok) {
      throw new Error(`GitHub responded with status ${response.status}`);
    }

    const repo = pickRepoFields(await response.json());
    writeRepoCache(repo);
    renderRepo(card, repo);
  } catch (error) {
    console.error('Could not load Omnia from GitHub:', error);
    renderRepoFallback(card);
  }
}

// Keep only the GitHub values that the card displays.
function pickRepoFields(repo) {
  return {
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    updatedAt: repo.pushed_at,
  };
}

function readRepoCache() {
  const raw = localStorage.getItem(REPO_CACHE_KEY);
  if (!raw) return null;

  try {
    const { savedAt, data } = JSON.parse(raw);
    const isFresh = Date.now() - savedAt < CACHE_MAX_AGE;
    return isFresh ? data : null;
  } catch {
    // The saved value was not valid JSON, so ignore it and fetch fresh data.
    return null;
  }
}

function writeRepoCache(repo) {
  const entry = { savedAt: Date.now(), data: repo };
  localStorage.setItem(REPO_CACHE_KEY, JSON.stringify(entry));
}

function renderRepo(card, repo) {
  // Keep the HTML fallback description if GitHub has no description.
  if (repo.description) {
    card.querySelector('.gh-desc').textContent = repo.description;
  }

  card.querySelector('.gh-language').textContent = repo.language || 'Mixed';
  card.querySelector('.gh-stars').textContent = `★ ${repo.stars}`;
  card.querySelector('.gh-updated').textContent =
    `Updated ${formatDate(repo.updatedAt)}`;

  // Keep the card's sort date in sync with GitHub's latest push date.
  card.dataset.date = repo.updatedAt.slice(0, 10);
  updateProjects(); // Re-sort after updating Omnia's date.

  finishLoading(card);
}

function renderRepoFallback(card) {
  card.querySelector('.gh-stats').hidden = true;
  card.querySelector('.gh-note').hidden = false;
  finishLoading(card);
}

// Loading means the skeleton class is active and aria-busy is true.
// Remove the skeleton and clear aria-busy when loading ends.
function finishLoading(card) {
  card.classList.remove('is-loading');
  card.setAttribute('aria-busy', 'false');
}

// Example: "2026-11-13T09:41:00Z" becomes "13 Nov 2026".
function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/* ---------- 6. Project category/level filters and sorting (choices saved) ---------- */

const PROJECT_PREFS_KEY = 'projectPrefs';
const DEFAULT_PREFS = { category: 'all', level: 'all', sort: 'newest' };

const LEVEL_MESSAGES = {
  all: '',
  beginner: 'Projects from my early courses, where I learned the fundamentals.',
  advanced: 'Projects where I combined tools and concepts to build more complete solutions.',
};

let projectPrefs = loadProjectPrefs();

function initProjectControls() {
  const levelSelect = document.getElementById('level-select');
  const sortSelect = document.getElementById('sort-select');
  const clearBtn = document.getElementById('clear-filters');

  if (!levelSelect || !sortSelect || !clearBtn) return;

  // Put the saved choices back into the dropdowns.
  levelSelect.value = projectPrefs.level;
  sortSelect.value = projectPrefs.sort;

  document.querySelectorAll('.filter-btn[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      projectPrefs.category = btn.dataset.filter;
      updateProjects();
    });
  });

  levelSelect.addEventListener('change', () => {
    projectPrefs.level = levelSelect.value;
    updateProjects();
  });

  sortSelect.addEventListener('change', () => {
    projectPrefs.sort = sortSelect.value;
    updateProjects();
  });

  clearBtn.addEventListener('click', () => {
    // Reset category and level; keep the current sort choice.
    projectPrefs.category = 'all';
    projectPrefs.level = 'all';
    levelSelect.value = 'all';
    updateProjects();
  });

  updateProjects();
}

// The controls and GitHub fetch call this function to update the project list.
function updateProjects() {
  const grid = document.querySelector('.projects-grid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.project-card'));
  const { category, level, sort } = projectPrefs;

  // Step 1: show or hide each card.
  let visibleCount = 0;

  cards.forEach((card) => {
    const matchesCategory =
      category === 'all' || card.dataset.category === category;
    const matchesLevel =
      level === 'all' || card.dataset.level === level;
    const isVisible = matchesCategory && matchesLevel;

    card.hidden = !isVisible;
    if (isVisible) visibleCount++;
  });

  // Step 2: sort, then re-append. appendChild moves existing cards.
  cards.sort((a, b) => compareCards(a, b, sort));
  cards.forEach((card) => grid.appendChild(card));

  // Step 3: show the empty-results message only when no cards match.
  document.getElementById('no-results').hidden = visibleCount > 0;

  // Step 4: update the message for the selected level.
  document.getElementById('level-message').textContent = LEVEL_MESSAGES[level];

  // Step 5: highlight the selected category button.
  document.querySelectorAll('.filter-btn[data-filter]').forEach((btn) => {
    btn.setAttribute(
      'aria-pressed',
      String(btn.dataset.filter === category)
    );
  });

  saveProjectPrefs();
}

// Comparator for Array.sort: negative means a goes first, positive means b goes first.
function compareCards(a, b, sort) {
  const titleA = a.querySelector('h3').textContent.trim();
  const titleB = b.querySelector('h3').textContent.trim();

  if (sort === 'az') return titleA.localeCompare(titleB);

  // YYYY-MM-DD strings sort correctly as plain text.
  const dateA = a.dataset.date;
  const dateB = b.dataset.date;

  // If dates match, use the titles for a consistent order.
  if (dateA === dateB) return titleA.localeCompare(titleB);

  if (sort === 'newest') return dateB.localeCompare(dateA);
  return dateA.localeCompare(dateB);
}

function loadProjectPrefs() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROJECT_PREFS_KEY));
    return { ...DEFAULT_PREFS, ...saved };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

function saveProjectPrefs() {
  localStorage.setItem(PROJECT_PREFS_KEY, JSON.stringify(projectPrefs));
}

/* ---------- 7. Time-on-site timer ---------- */

function initVisitTimer() {
  const timerEl = document.getElementById('visit-timer');
  if (!timerEl) return;

  const startTime = Date.now();

  setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    timerEl.textContent = `${pad(minutes)}:${pad(seconds)}`;
  }, 1000);
}

// 7 becomes "07".
function pad(number) {
  return String(number).padStart(2, '0');
}