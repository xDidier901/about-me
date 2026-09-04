const STORAGE_KEYS = { theme: "theme", lang: "lang" };

const englishDefaults = new Map();
document.querySelectorAll("[data-i18n]").forEach((el) => {
  englishDefaults.set(el, el.textContent.trim());
});

function renderKeywords(lang) {
  const rows = [document.getElementById("marquee-row-1"), document.getElementById("marquee-row-2")];

  rows.forEach((row, rowIndex) => {
    const items = KEYWORDS.filter((_, i) => i % rows.length === rowIndex);
    row.replaceChildren();

    // Duplicated so the -50% translation loops seamlessly.
    [...items, ...items].forEach((keyword) => {
      const badge = document.createElement("span");
      badge.className = "badge rounded-pill text-primary bg-primary-subtle";
      badge.textContent = keyword[lang] ?? keyword.en;
      row.append(badge);
    });
  });
}

function applyLanguage(lang) {
  const dictionary = TRANSLATIONS[lang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const value = dictionary ? dictionary[key] : englishDefaults.get(el);
    el.textContent = value ?? englishDefaults.get(el);
  });

  renderKeywords(lang);
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });
  localStorage.setItem(STORAGE_KEYS.lang, lang);
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.bsTheme = theme;

  const toggle = document.getElementById("theme-toggle");
  toggle.setAttribute("aria-pressed", String(isDark));
  document.getElementById("theme-icon").className = isDark ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

document.querySelectorAll("[data-lang]").forEach((btn) => {
  btn.addEventListener("click", () => applyLanguage(btn.dataset.lang));
});

document.getElementById("theme-toggle").addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.bsTheme === "dark" ? "light" : "dark");
});

// Defaults: dark theme, English. A previous choice always wins.
applyTheme(localStorage.getItem(STORAGE_KEYS.theme) ?? "dark");
applyLanguage(localStorage.getItem(STORAGE_KEYS.lang) ?? "en");

document.getElementById("year").textContent = String(new Date().getFullYear());
