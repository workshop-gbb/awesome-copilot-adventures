export function enhanceAdventureFilms() {
  const gallery = document.querySelector('[data-adventure-films]');
  if (!gallery) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hoverless = matchMedia('(hover: none)');
  const players = [...gallery.querySelectorAll('[data-adventure-film]')].map(card => {
    const video = card.querySelector('[data-adventure-video]');
    const trigger = card.querySelector('[data-film-trigger]');
    const status = card.querySelector('[data-film-status]');
    let attempt = 0;
    let pending = false;
    const showPoster = ({ announce = false, reset = false } = {}) => {
      attempt++;
      pending = false;
      video.pause();
      if (reset) video.currentTime = 0;
      delete card.dataset.playing;
      trigger.setAttribute('aria-pressed', 'false');
      status.textContent = announce ? gallery.dataset.videoPaused : '';
    };
    const reportError = error => {
      showPoster();
      status.textContent = gallery.dataset.videoError;
      console.error('Adventure animation playback failed.', error);
    };
    const playFilm = async ({ explicit = false } = {}) => {
      if (!explicit && (reducedMotion.matches || hoverless.matches)) return;
      if (pending || card.dataset.playing === 'true') return;
      for (const player of players) {
        if (player.video !== video) player.showPoster();
      }
      const currentAttempt = ++attempt;
      pending = true;
      status.textContent = '';
      if (!video.hasAttribute('src')) {
        video.src = video.dataset.videoSrc;
        video.load();
      }
      try {
        await video.play();
        if (currentAttempt !== attempt) return;
        pending = false;
        card.dataset.playing = 'true';
        trigger.setAttribute('aria-pressed', 'true');
        status.textContent = explicit ? gallery.dataset.videoPlaying : '';
      } catch (error) {
        if (currentAttempt !== attempt) return;
        if (error?.name === 'AbortError') {
          showPoster();
          console.info('Adventure animation playback was interrupted by the browser.');
          return;
        }
        reportError(error);
      }
    };
    trigger.addEventListener('mouseenter', () => playFilm());
    trigger.addEventListener('mouseleave', () => showPoster());
    trigger.addEventListener('focus', () => playFilm());
    trigger.addEventListener('blur', () => showPoster());
    trigger.addEventListener('click', () => {
      if (pending || card.dataset.playing === 'true') showPoster({ announce: true });
      else playFilm({ explicit: true });
    });
    video.addEventListener('error', () => {
      if (video.hasAttribute('src')) reportError(video.error);
    });
    return { video, showPoster };
  });
  reducedMotion.addEventListener('change', event => {
    if (event.matches) for (const player of players) player.showPoster({ reset: true });
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) for (const player of players) player.showPoster({ reset: true });
  });
  addEventListener('pagehide', () => {
    for (const player of players) player.showPoster({ reset: true });
  });
}
