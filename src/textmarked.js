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
    const editor = document.createElement('div');
    editor.classList.add('textmarked');

    const offset = textarea.getBoundingClientRect();

    editor.style.height = Math.round(offset.height) + 'px';
    editor.style.width  = Math.round(offset.width)  + 'px';

    // Create menu elements.
    const ul = document.createElement('ul');
    ul.classList.add('actions');

    for (let i = 0; i < settings?.elements.length; i++) {
      const li = document.createElement('li');

      ul.appendChild(li);
    }

    editor.appendChild(ul);

    // Create textarea alternative.
    const newarea = document.createElement('div');
    newarea.classList.add('textarea');

    const insetBorder = 6;

    newarea.style.height = (Math.round(offset.height) - insetBorder) + 'px';
    newarea.style.width  = (Math.round(offset.width)  - insetBorder) + 'px';

    editor.appendChild(newarea);

    textarea.parentNode.insertBefore(editor, textarea);
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
