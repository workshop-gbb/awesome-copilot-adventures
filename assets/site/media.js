import { closeOnEscape } from './dialog.mjs';

export function enhanceMedia(labels, images = [...document.querySelectorAll('.document img')]) {
  if (!images.length) return () => {};
  let opener;
  let fullWidth = 0;
  const dialog = document.createElement('dialog');
  dialog.className = 'he-media-dialog';
  const header = document.createElement('div');
  header.className = 'he-media-heading';
  const title = document.createElement('h2');
  title.id = `media-dialog-title-${document.querySelectorAll('.he-media-dialog').length}`;
  dialog.setAttribute('aria-labelledby', title.id);
  title.textContent = labels.title;
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'button';
  close.textContent = labels.close;
  header.append(title, close);
  const figure = document.createElement('figure');
  const viewport = document.createElement('div');
  viewport.className = 'he-media-viewport';
  viewport.tabIndex = 0;
  viewport.setAttribute('role', 'region');
  viewport.setAttribute('aria-label', labels.title);
  const preview = document.createElement('img');
  const caption = document.createElement('figcaption');
  const zoom = document.createElement('button');
  zoom.type = 'button';
  zoom.className = 'button';
  zoom.textContent = labels.zoom;
  zoom.setAttribute('aria-pressed', 'false');
  const original = document.createElement('a');
  original.textContent = labels.original;
  const error = document.createElement('p');
  error.setAttribute('role', 'status');
  const actions = document.createElement('div');
  actions.className = 'he-media-actions';
  actions.append(zoom, original);
  viewport.append(preview);
  figure.append(viewport, caption);
  dialog.append(header, actions, figure, error);
  document.body.append(dialog);
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { if (opener?.isConnected) opener.focus(); });
  closeOnEscape(dialog);
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  preview.addEventListener('error', () => { error.textContent = labels.error; });
  zoom.addEventListener('click', () => {
    const enlarged = zoom.getAttribute('aria-pressed') !== 'true';
    zoom.setAttribute('aria-pressed', String(enlarged));
    zoom.textContent = enlarged ? labels.fit : labels.zoom;
    viewport.classList.toggle('is-zoomed', enlarged);
    preview.style.width = enlarged ? `${Math.max(fullWidth, viewport.clientWidth * 2)}px` : '';
    if (!enlarged) viewport.scrollTo(0, 0);
  });
  for (const [index, image] of images.entries()) {
    image.decoding = 'async';
    image.loading = index === 0 ? 'eager' : 'lazy';
    let reportedError = false;
    const reportError = () => {
      if (reportedError) return;
      reportedError = true;
      const message = document.createElement('span');
      message.className = 'he-media-error';
      message.setAttribute('role', 'status');
      message.textContent = labels.error;
      const link = document.createElement('a');
      link.href = image.src;
      link.textContent = labels.original;
      message.append(' ', link);
      image.after(message);
    };
    image.addEventListener('error', reportError, { once: true });
    const enhance = () => {
      if (!image.naturalWidth) { reportError(); return; }
      if (!image.hasAttribute('width')) image.width = image.naturalWidth;
      if (!image.hasAttribute('height')) image.height = image.naturalHeight;
      if (image.naturalWidth < 240 || image.closest('a, button')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'he-media-open';
      button.setAttribute('aria-label', `${labels.open}: ${image.alt || labels.title}`);
      button.setAttribute('aria-haspopup', 'dialog');
      const hint = document.createElement('span');
      hint.className = 'he-media-hint';
      hint.textContent = labels.open;
      image.before(button);
      button.append(image, hint);
      button.addEventListener('click', () => {
        opener = button;
        fullWidth = image.naturalWidth;
        error.textContent = '';
        preview.alt = image.alt;
        preview.src = image.currentSrc || image.src;
        caption.textContent = image.alt;
        original.href = image.currentSrc || image.src;
        original.target = '_blank';
        original.rel = 'noopener';
        zoom.setAttribute('aria-pressed', 'false');
        zoom.textContent = labels.zoom;
        viewport.classList.remove('is-zoomed');
        preview.style.width = '';
        dialog.showModal();
        close.focus();
      });
    };
    if (image.complete) enhance();
    else image.addEventListener('load', enhance, { once: true });
  }
  return () => {
    if (dialog.open) dialog.close();
    dialog.remove();
  };
}
