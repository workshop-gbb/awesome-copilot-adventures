# Free shipping fails at the equality boundary

**Expected:** shipping is free for a subtotal of at least 5000 integer cents.
**Observed in the starter:** the calculation charges 500 cents at exactly 5000.

Reproduce with `node --test issue.test.mjs`.
Preserve validation and all other fee rules. No database, network, real customer
data, or account changes are involved.
