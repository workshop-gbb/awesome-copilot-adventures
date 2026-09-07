import { closeOnEscape } from './dialog.mjs';

export function enhanceMedia(labels) {
  const images = [...document.querySelectorAll('.document img')];
  if (!images.length) return;
  let opener;
  const dialog = document.createElement('dialog');
  dialog.className = 'he-media-dialog';
  dialog.setAttribute('aria-labelledby', 'media-dialog-title');
  const header = document.createElement('div');
  header.className = 'he-media-heading';
  const title = document.createElement('h2');
  title.id = 'media-dialog-title';
  title.textContent = labels.title;
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'button';
  close.textContent = labels.close;
  header.append(title, close);
  const figure = document.createElement('figure');
  const preview = document.createElement('img');
  const caption = document.createElement('figcaption');
  const original = document.createElement('a');
  original.textContent = labels.original;
  const error = document.createElement('p');
  error.setAttribute('role', 'status');
  figure.append(preview, caption);
  dialog.append(header, figure, error, original);
  document.body.append(dialog);
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => opener?.focus());
  closeOnEscape(dialog);
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  preview.addEventListener('error', () => { error.textContent = labels.error; });
  for (const [index, image] of images.entries()) {
    image.decoding = 'async';
    image.loading = index === 0 ? 'eager' : 'lazy';
    const reportError = () => {
      const message = document.createElement('p');
      message.className = 'he-media-error';
      message.textContent = labels.error;
      const link = document.createElement('a');
      link.href = image.src;
      link.textContent = labels.original;
      message.append(' ', link);
      image.parentElement.after(message);
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
        error.textContent = '';
        preview.alt = image.alt;
        preview.src = image.currentSrc || image.src;
        caption.textContent = image.alt;
        original.href = image.currentSrc || image.src;
        dialog.showModal();
        close.focus();
      });
    };
    if (image.complete) enhance();
    else image.addEventListener('load', enhance, { once: true });
  }
}
