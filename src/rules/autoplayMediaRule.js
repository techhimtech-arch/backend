/**
 * WCAG 1.4.2 - Audio Control
 * If audio plays automatically for more than 3 seconds, a mechanism to pause/stop must be available.
 */
const { buildSelectorPath } = require('./utils');

const autoplayMediaRule = {
  id: 'GIGW_A11Y_AUTOPLAY_001',
  title: 'No autoplay audio without controls',
  description:
    'Checks for audio/video that autoplays. GIGW requires controls or short duration (≤3 sec).',
  category: 'Accessibility',
  severity: 'medium',
  guidelineRef: {
    standard: 'GIGW',
    section: 'Accessibility',
    clause: 'Audio control (WCAG 1.4.2)',
  },
  check($) {
    const autoplayMedia = [];
    const hasControls = [];

    $('video[autoplay], audio[autoplay]').each((_, el) => {
      const $el = $(el);
      const tag = el.tagName.toLowerCase();
      const hasControl = $el.attr('controls') != null;
      const isMuted = $el.attr('muted') != null;

      if (hasControl || isMuted) {
        hasControls.push({
          tag,
          selector: buildSelectorPath($el),
          muted: isMuted,
        });
      } else {
        autoplayMedia.push({
          tag,
          selector: buildSelectorPath($el),
          reason: 'autoplay_without_controls_or_mute',
        });
      }
    });

    if (autoplayMedia.length === 0) {
      return {
        status: 'pass',
        details: {
          autoplayWithControls: hasControls.length,
        },
        suggestions: [],
      };
    }

    return {
      status: 'fail',
      details: {
        problematicCount: autoplayMedia.length,
        examples: autoplayMedia.slice(0, 10),
      },
      suggestions: [
        'Add controls attribute so users can pause/stop autoplay audio.',
        'Or use muted for autoplay video (e.g. hero background) – audio still needs explicit control.',
      ],
    };
  },
};

module.exports = autoplayMediaRule;
