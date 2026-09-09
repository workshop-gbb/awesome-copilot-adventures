/* Arms mechanism scenes when they enter the viewport and disarms them when they leave, so a scene
   replays on return, exactly like the deck contract. Reduced motion shows every scene complete. */
export function enhanceScenes() {
  const scenes = [...document.querySelectorAll('[data-scene]')];
  if (!scenes.length) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const armAll = () => { for (const scene of scenes) scene.dataset.active = 'true'; };
  if (reducedMotion.matches || !('IntersectionObserver' in window)) { armAll(); return; }
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) entry.target.dataset.active = entry.isIntersecting ? 'true' : 'false';
  }, { threshold: 0.3 });
  for (const scene of scenes) observer.observe(scene);
  for (const button of document.querySelectorAll('[data-scene-replay]')) {
    button.addEventListener('click', () => {
      const scene = button.closest('[data-scene]');
      scene.dataset.active = 'false';
      requestAnimationFrame(() => requestAnimationFrame(() => { scene.dataset.active = 'true'; }));
    });
  }
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) { observer.disconnect(); armAll(); }
  });
  addEventListener('pagehide', event => { if (!event.persisted) observer.disconnect(); });
}
