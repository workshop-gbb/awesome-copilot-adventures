(() => {
  try {
    const saved = localStorage.getItem('aca-theme');
    if (saved === 'dark' || saved === 'light') document.documentElement.dataset.theme = saved;
  } catch (error) {
    if (!(error instanceof DOMException)) throw error;
    console.warn('Theme preference storage is unavailable; the default theme is active.', error.name);
  }
})();
