export function createStore() {
  const subscriptions = [];
  return {
    add(value) {
      if (typeof value !== 'string' || value.trim() === '') throw new TypeError('A feed URL is required.');
      let url;
      try {
        url = new URL(value.trim());
      } catch {
        throw new TypeError('A valid HTTP(S) URL is required.');
      }
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) {
        throw new TypeError('Use HTTP(S) without embedded credentials.');
      }
      url.hash = '';
      const normalized = url.href;
      if (subscriptions.some(item => item.url === normalized)) {
        throw Object.assign(new Error('The feed is already subscribed.'), { code: 'DUPLICATE_FEED' });
      }
      const item = { id: `feed-${subscriptions.length + 1}`, url: normalized };
      subscriptions.push(item);
      return { ...item };
    },
    list() {
      return subscriptions.map(item => ({ ...item }));
    }
  };
}
