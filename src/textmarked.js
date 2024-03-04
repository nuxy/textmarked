/**
 *  textmarked
 *  Enable Markdown editing in HTML <textarea />
 *
 *  Copyright 2024, Marc S. Brooks (https://mbrooks.info)
 *  Licensed under the MIT license:
 *  http://www.opensource.org/licenses/mit-license.php
 */

'use strict';

/**
 * @param {Element} textarea
 *   HTML textarea element.
 *
 * @param {Object} settings
 *   Editor settings.
 */
function TextMarked(textarea, settings) {
  const self = this;

  (function() {
    if (settings?.elements.length) {
      renderEditor();
    } else {
      throw new Error('Failed to initialize (missing settings)');
    }
  })();

  /**
   * Render a Markdown editor instance.
   */
  function renderEditor() {
    const elmTotal = settings?.elements.length;

    const editor = document.createElement('div');
    editor.classList.add('textmarked');

    const offset = textarea.getBoundingClientRect();
    const height = Math.round(offset.height);
    const width  = Math.round(offset.width);

    editor.style.height = height + 'px';
    editor.style.width  = width  + 'px';

    // Create menu elements.
    const ul = document.createElement('ul');
    ul.classList.add('actions');

    const colXY = Math.round(width / elmTotal);

    for (let i = 0; i < elmTotal; i++) {
      const name = settings.elements[i];

      // .. List elements.
      const li = document.createElement('li');
      li.classList.add('icon');
      li.classList.add(name.toLowerCase());
      li.setAttribute('title', name);
      li.style.height = colXY + 'px';
      li.style.width  = colXY + 'px';

      ul.appendChild(li);
    }

    editor.appendChild(ul);

    // Create textarea alternative.
    const newarea = document.createElement('div');
    newarea.classList.add('textarea');

    const insetBorder = 2;

    newarea.style.minHeight = (height - insetBorder) + 'px';
    newarea.style.minWidth  = (width  - insetBorder) + 'px';

    editor.appendChild(newarea);

    textarea.parentNode.insertBefore(editor, textarea);

    // Hide original (use as cache).
    textarea.style.position   = 'absolute';
    textarea.style.visibility = 'hidden';
  }
}

/**
 * Set global/exportable instance, where supported.
 */
window.textMarked = function(container, settings) {
  return new TextMarked(container, settings);
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TextMarked;
}
