/* =========================================================
   Nadiah Albinali — Portfolio Script
   Features:
   1. Dark / light theme toggle (persisted in localStorage)
   2. Personalized greeting (time of day + visitor name saved in localStorage)
   3. Smooth scrolling + mobile nav toggle
   4. Contact form validation (client-side only, no backend)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  renderGreeting();
  initNameForm();
  initMobileNav();
  initContactForm();
  initGitHubCard();
  initFooterYear();
});

/* ---------- 1. Theme toggle ---------- */
function initThemeToggle() {
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');

  // Respect a saved preference, otherwise fall back to system preference
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

// Returns the time-based part of the greeting
function getTimeGreeting() {
  const hour = new Date().getHours();

  if (hour < 5) return 'Welcome, night owl';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Writes the greeting, adding the visitor's name if one is saved
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

// Restarts the fade-in animation on an element
function playFadeIn(el) {
  el.classList.remove('fade-in');
  void el.offsetWidth; // forces the browser to notice the removal
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

  // Handles both clicking Save and pressing Enter in the input
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

  // Shows the form OR the "Change name" button, depending on whether a name is saved
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

  // Close the mobile menu after a link is clicked (smooth scroll is
  // handled natively via CSS `scroll-behavior: smooth` + href anchors)
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

  // Each field: what counts as valid, plus separate messages for empty vs invalid
  const fields = [
    {
      input: nameInput,
      isValid: (v) => v.length >= 2,
      emptyMsg: 'Please enter your name.',
      invalidMsg: 'Your name needs at least 2 characters.',
    },
    {
      input: emailInput,
      isValid: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      emptyMsg: 'Please enter your email address.',
      invalidMsg: 'That email looks incomplete. Try something like name@example.com.',
    },
    {
      input: messageInput,
      isValid: (v) => v.length >= 10,
      emptyMsg: 'Please write a message before sending.',
      invalidMsg: 'Your message is a bit short. Please write at least 10 characters.',
    },
  ];

  // Clear a field's error as soon as the visitor starts fixing it
  fields.forEach(({ input }) => {
    input.addEventListener('input', () => clearFieldError(input));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.textContent = '';

    const results = fields.map(validateField);
    const firstInvalid = fields.find((field, i) => !results[i]);

    if (firstInvalid) {
      firstInvalid.input.focus();
      return;
    }

    const name = nameInput.value.trim();
    successMsg.textContent = `Thanks, ${name}! Your message has been received. (This demo form isn’t connected to email yet.)`;
    playFadeIn(successMsg);
    form.reset();
  });

  // Checks one field and shows the right message (empty vs invalid)
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
/* ---------- 5. GitHub API: live Omnia card ---------- */
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

  // Keep the card's sort date in sync with GitHub's latest update date.
  card.dataset.date = repo.updatedAt.slice(0, 10);

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
    day: 'numeric', month: 'short', year: 'numeric',
  });
}