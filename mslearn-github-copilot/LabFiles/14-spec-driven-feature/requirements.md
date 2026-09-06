# Brownfield dashboard feature contract

The existing local module exposes `health()` and `projects()`. Preserve both shapes.
The requested feature registers **metadata**, not binary uploads.

- DOC-1: existing health/project behavior stays unchanged.
- DOC-2: add metadata for an existing project; assign owner from a trusted fixture
  actor, not an input field; list only that actor's records.
- DOC-3: reject an invalid project, blank/overlong title, missing actor, or owner
  spoofing without partial state.
- DOC-4: returned objects cannot mutate the store.

The actor object is a local test seam, not production authentication. A real web
adapter must establish identity independently. Binary uploads, storage paths, public
sharing, malware scanning and real employee data are separate features.
