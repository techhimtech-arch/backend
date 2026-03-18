/**
 * Build a simple CSS-like selector path for an element for reporting.
 * This is heuristic and not guaranteed unique, but good enough for evidence.
 */
function buildSelectorPath($el) {
  const segments = [];
  let current = $el;

  while (current && current.length && current[0].tagName && segments.length < 6) {
    const tag = current[0].tagName.toLowerCase();
    const id = current.attr('id');
    const className = (current.attr('class') || '')
      .split(/\s+/)
      .filter(Boolean)[0];

    if (id) {
      segments.unshift(`${tag}#${id}`);
      break;
    } else if (className) {
      segments.unshift(`${tag}.${className}`);
    } else {
      segments.unshift(tag);
    }

    current = current.parent();
  }

  return segments.join(' > ');
}

module.exports = {
  buildSelectorPath,
};

