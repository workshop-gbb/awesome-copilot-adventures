export function enhanceAdventureFilms() {
  const gallery = document.querySelector('[data-adventure-films]');
  if (!gallery) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const players = [...gallery.querySelectorAll('[data-adventure-film]')].map(card => {
    const video = card.querySelector('[data-adventure-video]');
    const poster = card.querySelector('[data-film-poster]');
    const play = card.querySelector('[data-film-play]');
    const still = card.querySelector('[data-film-still]');
    const status = card.querySelector('[data-film-status]');
    let attempt = 0;
    const showPoster = () => {
      attempt++;
      const restoreFocus = document.activeElement === video || document.activeElement === still;
      video.pause();
      video.removeAttribute('src');
      video.load();
      video.hidden = true;
      poster.hidden = false;
      play.hidden = false;
      play.disabled = false;
      still.hidden = true;
      status.textContent = '';
      if (restoreFocus) play.focus();
    };
    const reportError = error => {
      showPoster();
      status.textContent = gallery.dataset.videoError;
      console.error('Adventure animation playback failed.', error);
    };
    play.hidden = false;
    play.addEventListener('click', async () => {
      for (const player of players) {
        if (player.video !== video && !player.video.hidden) player.showPoster();
      }
      const currentAttempt = ++attempt;
      status.textContent = '';
      play.disabled = true;
      video.muted = true;
      video.src = video.dataset.videoSrc;
      poster.hidden = true;
      video.hidden = false;
      still.hidden = false;
      try {
        await video.play();
        if (currentAttempt !== attempt) return;
        play.hidden = true;
        video.focus();
      } catch (error) {
        // Switching clips or restoring the poster intentionally cancels pending playback.
        if (currentAttempt !== attempt) return;
        reportError(error);
      }
    });
    still.addEventListener('click', showPoster);
    video.addEventListener('error', () => {
      if (video.hasAttribute('src')) reportError(video.error);
    });
    video.addEventListener('ended', showPoster);
    return { video, showPoster };
  });
  reducedMotion.addEventListener('change', event => {
    if (event.matches) for (const player of players) player.showPoster();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) for (const player of players) player.showPoster();
  });
  addEventListener('pagehide', () => {
    for (const player of players) player.showPoster();
  });
}
