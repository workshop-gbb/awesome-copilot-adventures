type Subscription = { id: string; url: string };

export function createStore(): { add: (value: unknown) => Subscription; list: () => Subscription[] } {
  const subscriptions: Subscription[] = [];
  return {
    add(value: unknown): Subscription {
      if (typeof value !== 'string' || value.trim() === '') throw new TypeError('A feed URL is required.');
      let url: URL;
      try {
        url = new URL(value.trim());
      } catch {
        throw new TypeError('A valid HTTP(S) URL is required.');
      }
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) {
        throw new TypeError('Use HTTP(S) without embedded credentials.');
      }
      url.hash = '';
      if (subscriptions.some(item => item.url === url.href)) {
        throw Object.assign(new Error('The feed is already subscribed.'), { code: 'DUPLICATE_FEED' });
      }
      const item = { id: `feed-${subscriptions.length + 1}`, url: url.href };
      subscriptions.push(item);
      return { ...item };
    },
    list(): Subscription[] {
      return subscriptions.map(item => ({ ...item }));
    }
  };
}
