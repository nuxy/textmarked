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
    textarea.form.addEventListener('reset', function() {

      // Clear editor contents.
      self.content.textContent = '';
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
    _textarea.classList.add('content');
    _textarea.setAttribute('contenteditable', 'true');
    _textarea.setAttribute('tabindex', optionsTotal + 1);
    _textarea.innerText = textarea.value;

    const insetBorder = 12; // (border: 2px, padding: 4px) * 2

    _textarea.style.minHeight = (height - insetBorder) + 'px';
    _textarea.style.minWidth  = (width  - insetBorder) + 'px';

    _textarea.addEventListener('keydown', keyDownEvent);
    _textarea.addEventListener('keyup', keyUpEvent);
    _textarea.addEventListener('click', textSelectionEvent);

    self.content = _textarea;

    editor.appendChild(_textarea);

    textarea.parentNode.insertBefore(editor, textarea);

    // Hide original (use as cache).
    textarea.style.position   = 'absolute';
    textarea.style.visibility = 'hidden';
  }

  /**
   * Handle key events (keydown).
   *
   * @inheritdoc
   */
  function keyDownEvent(event) {
    const chars = settings?.allowKeys || `a-z0-9\\s,.?!$%&()"''`;
    const {key, target} = event;

    if ((new RegExp(`^[${chars}]{1}$`, 'i').test(key)) || key === 'Backspace' || (key === 'Enter' && settings?.allowEnter)) {

      // Sync changes w/ cache.
      textarea.value = target.innerText;

    } else {

      // Disable unsupported.
      return event.preventDefault();
    }
  }

  /**
   * Handle key events (keyup).
   *
   * @inheritdoc
   */
  function keyUpEvent(event) {
    const {target} = event;

    // Sync changes w/ cache.
    textarea.value = target.innerText;

    target.click();
  }

  /**
   * Handle button events (click).
   *
   * @inheritdoc
   */
  function buttonEvent(event) {
    const selection = self.selection;

    if (!selection) {
      return;
    }

    const {node, start, end, value} = selection;
    const {target} = event;

    let markdown;

    switch (target.title) {
      case 'Heading':
        markdown = '# ' + value;
      break;

      case 'Bold':
        markdown = '**' + value + '**';
      break;

      case 'Italic':
        markdown = '_' + value + '_';
      break;

      case 'Blockquote':
        markdown = '> ' + value;
      break;

      case 'Code':
        markdown = '`' + value + '`';
      break;

      case 'Horizontal-Rule':
        markdown = '---';
      break;

      case 'Link':
        markdown = '[' + value + '](url)';
      break;

      case 'Image':
        markdown = '![' + value + '](url)';
      break;
    }

    // Wrap selected text in Markdown.
    node.textContent = replaceInStr(node.textContent, start, end, markdown);

    textarea.value = self.content.innerText;

    self.selection = null;
  }

  /**
   * Handle text selection events (click).
   *
   * @inheritdoc
   */
  function textSelectionEvent() {
    const selection = window.getSelection();

    const {focusNode, focusOffset, anchorOffset} = selection;

    self.selection = {
      node: focusNode,

      // .. inverted selections.
      start: (focusOffset > anchorOffset) ? anchorOffset : focusOffset,
      end:   (focusOffset < anchorOffset) ? anchorOffset : focusOffset,

      value: selection.toString()
    };
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

  /**
   * Replace value in a text string.
   *
   * @param {String} str
   *   Text string to process.
   *
   * @param {Number} start
   *   Start character position.
   *
   * @param {Number} end
   *   End character position.
   *
   * @param {String} value
   *   String replacement value.
   *
   * @return {String}
   */
  function replaceInStr(str = '', start = 0, end = 0, value = '') {
    const chars = str.split('');
    const count = (end - start);
    chars.splice(start, count, value);
    return chars.join('');
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
