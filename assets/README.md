# Media assets

- `images/adventures/` contains 14 generated WebP covers, their supplied JPEG originals and the original SVG concept illustrations.
- `images/legacy/` preserves artwork from the version-one curriculum.
- `video/adventures/` contains 3 silent, optional MP4 teasers and their still posters for the Pages site.

The supplied media was prepared on 2026-09-08. The [media inventory](adventure-media.json)
maps each optimized asset to its original; original JPEGs and MP4s remain unchanged.
See the [cover inventory](images/adventures/README.md), [video notes](video/README.md)
and [media prompt catalog](../docs/media-prompts.md).

Required hero format:

- 1456×832 pixels;
- PNG or WebP;
- keep essential text outside the artwork and preserve source provenance;
- meaningful alt text in the consuming page;
- retain a still image when adding video.

Motion assets must not autoplay with sound and must respect `prefers-reduced-motion`.
The site loads the silent teasers only after an explicit play action and offers
native controls, a still-image reset, localized descriptions and direct file links.
