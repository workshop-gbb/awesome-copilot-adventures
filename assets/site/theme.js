(() => {
  let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  try {
    const saved = localStorage.getItem('aca-theme');
    if (saved === 'dark' || saved === 'light') theme = saved;
  } catch (error) {
    if (!(error instanceof DOMException)) throw error;
    console.warn('Theme preference storage is unavailable; the system theme is active.', error.name);
  }
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.heTheme = theme;
})();
