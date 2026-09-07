"""Browser state shared by the visual quality gates."""

SETTLE_ENTRANCES = """() => {
  const slide = document.querySelector('.slide[data-active="true"]');
  if (!slide) throw new Error('No active slide');
  for (const animation of slide.getAnimations({subtree: true})) {
    const timing = animation.effect.getComputedTiming();
    if (Number.isFinite(timing.endTime) && animation.playbackRate !== 0) {
      animation.finish();
    }
  }
}"""
