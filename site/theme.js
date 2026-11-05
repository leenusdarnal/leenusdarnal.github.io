(() => {
  const root = document.documentElement;
  const button = document.getElementById('theme-toggle');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const systemPreference = window.matchMedia?.('(prefers-color-scheme: light)');

  function readSavedTheme() {
    try { return localStorage.getItem('site-theme'); } catch (_) { return null; }
  }

  function setTheme(theme, persist = false) {
    root.dataset.theme = theme;

    if (button) {
      const next = theme === 'dark' ? 'light' : 'dark';
      button.textContent = next === 'light' ? 'Light mode' : 'Dark mode';
      button.setAttribute('aria-label', `Switch to ${next} mode`);
      button.setAttribute('aria-pressed', String(theme === 'light'));
    }

    if (themeColor) {
      themeColor.setAttribute('content', theme === 'dark' ? '#111614' : '#fbfcfa');
    }

    if (persist) {
      try { localStorage.setItem('site-theme', theme); } catch (_) { /* Storage may be unavailable. */ }
    }
  }

  setTheme(root.dataset.theme === 'light' ? 'light' : 'dark');

  button?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
  });

  systemPreference?.addEventListener?.('change', (event) => {
    if (readSavedTheme() === null) setTheme(event.matches ? 'light' : 'dark');
  });
})();
