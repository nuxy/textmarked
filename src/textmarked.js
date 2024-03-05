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
    if (settings?.options.length) {
      self.selection = {};

      bindFormReset();
      renderEditor();
    } else {
      throw new Error('Failed to initialize (missing settings)');
    }
  })();

  /**
   * Add listener to associated form.
   */
  function bindFormReset() {
    textarea.form.addEventListener('reset', () => {

      // Clear editor contents.
      self._textarea.data = '';
    });
  }

  /**
   * Render a Markdown editor instance.
   */
  function renderEditor() {
    const actionTotal = settings?.options.length;

    const editor = document.createElement('div');
    editor.classList.add('textmarked');

    const offset = textarea.getBoundingClientRect();
    const height = Math.round(offset.height);
    const width  = Math.round(offset.width);

    editor.style.height = height + 'px';
    editor.style.width  = width  + 'px';

    // Create button elements.
    const ul = document.createElement('ul');
    ul.classList.add('actions');

    const buttonXY = Math.round(width / actionTotal);

    for (let i = 0; i < actionTotal; i++) {
      const name = settings.options[i];

      const li = document.createElement('li');
      li.classList.add('icon');
      li.classList.add(name);
      li.setAttribute('tabindex', i + 1);
      li.setAttribute('title', name);

      // .. dimensions.
      li.style.height = buttonXY + 'px';
      li.style.width  = buttonXY + 'px';

      ul.appendChild(li);
    }

    editor.appendChild(ul);

    // Create textarea alternative.
    const _textarea = document.createElement('div');
    _textarea.classList.add('textarea');
    _textarea.setAttribute('contenteditable', 'true');
    _textarea.setAttribute('tabindex', actionTotal + 1);
    _textarea.textContent = textarea.value;

    const insetBorder = 12; // (border: 2px, padding: 4px) * 2

    _textarea.style.minHeight = (height - insetBorder) + 'px';
    _textarea.style.minWidth  = (width  - insetBorder) + 'px';

    _textarea.addEventListener('keyup', keyboardEvent);
    _textarea.addEventListener('mouseup', textSelectionEvent);

    editor.appendChild(_textarea);

    self._textarea = _textarea;

    textarea.parentNode.insertBefore(editor, textarea);

    // Hide original (use as cache).
    textarea.style.position   = 'absolute';
    textarea.style.visibility = 'hidden';
  }

  /**
   * Handle keyboard events (keyup).
   *
   * @inheritdoc
   */
  function keyboardEvent(event) {
    const chars = settings?.allowKeys || `a-z0-9\\s,.?!$%&()"''`;

    let cache = textarea.value;

    if ((new RegExp(`^[${chars}]{1}$`, 'i')).test(event.key)) {

      // .. append key value.
      cache += event.key;

    } else if (event.key === 'Enter' && settings?.allowEnter) {

      // .. append a newline.
      cache += '\n';

    } else if (event.key === 'Backspace') {

      // .. remove last value.
      cache = cache.slice(0, -1);
    }

    textarea.value = cache;

    self._textarea.data = convertToMarkup(cache);
  }

  /**
   * Handle text selection events (mouseup).
   *
   * @inheritdoc
   */
  function textSelectionEvent() {
    const selection = window.getSelection();

    self.selection = {
      start: selection.focusOffset,
      end: selection.anchorOffset,
      value: selection.toString()
    }
  }

  /**
   * Convert Markdown to HTML equivalent.
   *
   * @param {String} value
   *   Text string to process.
   *
   * @return {String}
   */
  function convertToMarkup(value) {
    return value.replace(/\n/gm, '<br />'); // Newline
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
