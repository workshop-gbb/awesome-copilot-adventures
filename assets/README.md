# Media assets

- `images/adventures/` contains 14 generated WebP covers, their supplied JPEG originals and the original SVG concept illustrations.
- `images/hands-on/` contains 26 professional WebP covers, their supplied JPEG originals and the original SVG concept illustrations.
- `images/legacy/` preserves artwork from the version-one curriculum.
- `video/adventures/` contains 3 silent, optional MP4 teasers and their still posters for the Pages site.

The supplied media was prepared on 2026-09-08. The [media inventory](adventure-media.json)
maps each optimized asset to its original; original JPEGs and MP4s remain unchanged.
See the [cover inventory](images/adventures/README.md), [video notes](video/README.md)
and [media prompt catalog](../docs/media-prompts.md).

The [hands-on inventory](hands-on-media.json) maps the supplied `L01.jpeg` through
`L26.jpeg` images to the 26 preparation guides and exercises. Their WebP covers
are downscaled without stretching. Most use a centered crop; the conditionals
and SDK application covers use side padding to preserve the complete scene.
The JPEG originals remain unchanged. Each guide retains its localized SVG in an
expandable concept view. The covers are illustrations, not product screenshots
or evidence of test results.

Required hero format:

- 1456×832 pixels for adventures; 1440×630 pixels for hands-on guides;
- PNG or WebP;
- keep essential text outside the artwork and preserve source provenance;
- meaningful alt text in the consuming page;
- retain a still image when adding video.

Motion assets must not autoplay with sound and must respect `prefers-reduced-motion`.
The site loads silent teasers only after interaction with an integrated scene
button. Hover or keyboard focus previews a scene; activation toggles playback.
Reduced motion and touch require explicit activation. Leaving a scene restores
its poster. Localized descriptions, playback status and direct file links remain
available without detached video controls.
