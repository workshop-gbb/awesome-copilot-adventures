# Media assets

- `images/adventures/` contains reviewed production hero assets when generated.
- `images/legacy/` preserves artwork from the version-one curriculum.
- `video/` contains optional motion assets for the Pages site.

Production hero files are intentionally pending. Generate them using the [media prompt catalog](../docs/media-prompts.md).

Required hero format:

- 1456×832 pixels;
- PNG or WebP;
- no embedded text or watermark;
- meaningful alt text in the consuming page;
- retain a still image when adding video.

Motion assets must not autoplay with sound and must respect `prefers-reduced-motion`.
