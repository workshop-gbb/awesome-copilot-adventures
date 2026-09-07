# RSS subscription behavior

The first increment manages a local subscription list. It does not fetch feeds.

| ID | Requirement | Acceptance |
| --- | --- | --- |
| RSS-1 | Add and list subscriptions | Stable `feed-N` IDs, normalized URLs and insertion order |
| RSS-2 | Reject duplicates | Surrounding whitespace, URL fragments and host case do not create another subscription |
| RSS-3 | Reject invalid inputs | Blank, malformed, non-HTTP(S), or embedded-credential URLs fail without state changes |
| RSS-4 | Protect internal state | Returned lists and records are copies |

Normalization uses URL parsing: trim surrounding whitespace, normalize host names,
and remove fragments. Path case is preserved.

No HTTP call is made to validate feed content. A syntactically acceptable URL is
not proof that an RSS/Atom feed exists.

## Deferred features

Feed fetching, parsing, persistence, deletion, authentication, automatic polling and
rich HTML rendering need separate specifications and acceptance tests. They are not
part of this MVP or an excuse to skip input validation.
