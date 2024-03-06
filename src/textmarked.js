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
    textarea.form.addEventListener('reset', function(event) {

      // Clear editor contents.
      event.target.querySelector('.textarea').textContent = '';
    });
  }

  /**
   * Render a Markdown editor instance.
   */
  function renderEditor() {
    const optionsTotal = settings?.options.length;

    const editor = document.createElement('div');
    editor.classList.add('textmarked');

    const offset = textarea.getBoundingClientRect();
    const height = Math.round(offset.height);
    const width  = Math.round(offset.width);

    editor.style.height = height + 'px';
    editor.style.width  = width  + 'px';

    // Create button elements.
    const ul = document.createElement('ul');
    ul.classList.add('options');

    const buttonXY = Math.round(width / optionsTotal);

    for (let i = 0; i < optionsTotal; i++) {
      const name = settings.options[i];

      const li = document.createElement('li');
      li.classList.add('icon');
      li.classList.add(name);
      li.setAttribute('tabindex', i + 1);
      li.setAttribute('title', name);

      li.style.height = buttonXY + 'px';
      li.style.width  = buttonXY + 'px';

      li.addEventListener('click', buttonEvent);

      ul.appendChild(li);
    }

    editor.appendChild(ul);

    // Create textarea alternative.
    const _textarea = document.createElement('div');
    _textarea.classList.add('textarea');
    _textarea.setAttribute('contenteditable', 'true');
    _textarea.setAttribute('tabindex', optionsTotal + 1);
    _textarea.textContent = textarea.value;

    const insetBorder = 12; // (border: 2px, padding: 4px) * 2

    _textarea.style.minHeight = (height - insetBorder) + 'px';
    _textarea.style.minWidth  = (width  - insetBorder) + 'px';

    _textarea.addEventListener('keydown', keyboardEvent);
    _textarea.addEventListener('click', textSelectionEvent);

    editor.appendChild(_textarea);

    textarea.parentNode.insertBefore(editor, textarea);

    // Hide original (use as cache).
    textarea.style.position   = 'absolute';
    textarea.style.visibility = 'hidden';
  }

  /**
   * Handle keyboard events (keydown).
   *
   * @inheritdoc
   */
  function keyboardEvent(event) {
    const chars = settings?.allowKeys || `a-z0-9\\s,.?!$%&()"''`;
    const {key} = event;

    let cache = textarea.value;

    if ((new RegExp(`^[${chars}]{1}$`, 'i')).test(key)) {

      // .. append key value.
      cache += key;

    } else if (key === 'Enter' && settings?.allowEnter) {

      // .. append a newline.
      cache += '\n';

    } else if (key === 'Backspace') {

      // .. remove last value.
      cache = cache.slice(0, -1);
    }

    textarea.value = cache;

    event.target.data = convertToMarkup(cache);
  }

  /**
   * Handle button events (click).
   *
   * @inheritdoc
   */
  function buttonEvent(event) {
    const {start, end, value} = self.selection;
    const {target} = event;

    let markdown;

    switch (target.title) {
      case 'Bold':
        markdown = '**' + value + '**';
      break;

      case 'Italic':
        markdown = '_' + value + '_';
      break;

      case 'Code':
        markdown = '`' + value + '`';
      break;
    }

    let cache = textarea.value;

    // Wrap selection in Markdown.
    cache = cache.split('');
    cache.splice(start, (end - start), markdown);
    cache = cache.join('');

    textarea.value = cache;

    self.selection.target.textContent = cache;
  }

  /**
   * Handle text selection events (click).
   *
   * @inheritdoc
   */
  function textSelectionEvent(event) {
    const selection = window.getSelection();

    self.selection = {
      start: selection.focusOffset,
      end: selection.anchorOffset,
      value: selection.toString(),
      target: event.target
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
