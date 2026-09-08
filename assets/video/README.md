# Video assets

Three generated adventure montages were prepared on 2026-09-08. Their silent H.264
MP4 playback copies and first-frame WebP posters are in `adventures/`. Each is
1280 x 720, 24 frames per second and 10 seconds long. The supplied originals,
including their audio tracks, remain unchanged in `assets/images/adventures/`.

| Montage | Silent playback copy | Still poster |
| --- | --- | --- |
| Portals, context and iteration | [MP4](adventures/nexus-context-tempora.mp4) | [WebP](adventures/nexus-context-tempora-poster.webp) |
| From investigation to guardrails | [MP4](adventures/workflow-guardrails.mp4) | [WebP](adventures/workflow-guardrails-poster.webp) |
| Rules, skills and connections | [MP4](adventures/skills-connections.mp4) | [WebP](adventures/skills-connections-poster.webp) |

The [homepage](../../docs/index.md) and [adventure catalog](../../docs/adventures/index.md)
offer a gallery with localized descriptions. Video bytes are not requested before
interaction with a scene. Hover or keyboard focus previews its silent loop; the
integrated button toggles playback with a click, tap, Enter or Space. Moving the
pointer or focus away restores the poster. Starting another clip stops the
previous one. Hiding the page or enabling reduced motion pauses playback and
restores the still image without automatically resuming. Reduced motion and touch
require explicit activation instead of hover or focus. Playback and errors have
localized status messages, and the direct video link remains available.

Without JavaScript, the posters, descriptions and direct video links remain usable.
These silent visual montages add no required instructional information or spoken
content. They are not Copilot recordings or evidence of completed exercises.
Videos stay out of learner ZIPs; the optimized still cover and original concept SVG
are included in each adventure kit instead.

The [media inventory](../adventure-media.json) records source-to-output mappings.
FFmpeg was used for H.264, no-audio playback copies with the metadata at the start
of the file; WebP posters come from the original first frames. No codec tools or
transcoding run during normal site builds. WebM is optional and is not supplied
for these clips.

Every future video must have:

- a poster image;
- no required audio;
- a reduced-motion fallback;
- a descriptive caption in the consuming page.

See [docs/media-prompts.md](../../docs/media-prompts.md) for the generation prompts.
