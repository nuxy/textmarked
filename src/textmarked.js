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
function TextMarked(textarea, settings = {}) {
  const self = this;

  const defaults = {
    allowKeys: `a-z0-9\\s,.?!$%&()\\[\\]"'-_#*\`>`,
    allowEnter: false,
    clipboard: false
  };

  (function() {
    settings = Object.assign(defaults, settings);

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

    editor.style.width = width + 'px';

    // Create button elements.
    const ul = document.createElement('ul');
    ul.classList.add('options');
    ul.setAttribute('aria-label', 'Markdown options');
    ul.setAttribute('role', 'menu');

    const buttonXY = Math.round((width - (optionsTotal * 2)) / optionsTotal);

    for (let i = 0; i < optionsTotal; i++) {
      const name = settings.options[i];

      const li = document.createElement('li');
      li.classList.add('icon');
      li.classList.add(name);
      li.setAttribute('aria-label', name);
      li.setAttribute('role', 'button');
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
    _textarea.setAttribute('aria-label', 'Content editor');
    _textarea.setAttribute('role', 'textbox');
    _textarea.setAttribute('tabindex', optionsTotal + 1);
    _textarea.innerText = textarea.value;

    const insetBorder = 12; // (border: 2px, padding: 4px) * 2

    _textarea.style.minHeight = (height - insetBorder) + 'px';
    _textarea.style.minWidth  = (width  - insetBorder) + 'px';

    _textarea.addEventListener('keydown', keyDownEvent);
    _textarea.addEventListener('keyup', keyUpEvent);
    _textarea.addEventListener('click', textSelectionEvent);
    _textarea.addEventListener('copy', clipboardCopyEvent);
    _textarea.addEventListener('cut', clipboardCopyEvent);
    _textarea.addEventListener('paste', clipboardPasteEvent);

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
    const chars = settings?.allowKeys;
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

    let counter = 1;

    // Apply Markdown to selected text.
    for (let i = 0; i < node.length; i++) {
      const item = node[i];

      let markdown;

      if (i > 1) {

        // .. multi-line selection.
        switch (target.title) {
          case 'Blockquote':
            markdown = mBlockquote(item.data);
          break;

          case 'Ordered-List':
            markdown = mOrderedList(item.data, counter++);
          break;

          case 'Unordered-List':
            markdown = mUnorderedList(item.data);
          break;

          default:
            markdown = item.data;
        }

        item.textContent = markdown;

      } else {

        // .. focused selection.
        switch (target.title) {
          case 'Heading':
            markdown = mHeading(value);
          break;

          case 'Bold':
            markdown = mBold(value);
          break;

          case 'Italic':
            markdown = mItalic(value);
          break;

          case 'Blockquote':
            markdown = mBlockquote(value);
          break;

          case 'Ordered-List':
            markdown = mOrderedList(value);
          break;

          case 'Unordered-List':
            markdown = mUnorderedList(value);
          break;

          case 'Code':
            markdown = mCode(value);
          break;

          case 'Horizontal-Rule':
            markdown = mHorizontalRule(value);
          break;

          case 'Link':
            markdown = mLink(value);
          break;

          case 'Image':
            markdown = mImage(value);
          break;
        }

        item.textContent = replaceInStr(item.textContent, start, end, markdown);
      }
    }

    // Sync changes w/ cache.
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

    const {focusNode, focusOffset, anchorNode, anchorOffset} = selection;

    const contents = self.content.childNodes;
    const nodeList = [];

    let isRange = false;

    // Extract range of #text nodes.
    for (let i = 0; i < contents.length; i++) {
      const node = contents[i];

      let item = (node.tagName === 'DIV')
        ? node.firstChild : node

      if (item === focusNode) {
        isRange = true;
      }

      if (item.tagName !== 'BR' && isRange) {
        nodeList.push(item);
      }

      if (item === anchorNode) {
        isRange = false;
      }
    }

    self.selection = {
      node: (nodeList.length) ? nodeList : [focusNode],

      // .. inverted selections.
      start: (focusOffset > anchorOffset) ? anchorOffset : focusOffset,
      end:   (focusOffset < anchorOffset) ? anchorOffset : focusOffset,

      value: selection.toString()
    };
  }

  /**
   * Handle cliboard copy/cut events.
   *
   * @inheritdoc
   */
  function clipboardCopyEvent(event) {
    if (!settings.clipboard) {
      return event.preventDefault();
    }
  }

  /**
   * Handle cliboard paste events.
   *
   * @inheritdoc
   */
  function clipboardPasteEvent(event) {
    event.preventDefault();

    const selection = window.getSelection();

    if (!settings.clipboard || !selection.rangeCount) {
      return;
    }

    // Strip rich text from pasted output.
    const data = event.clipboardData.getData('text').split('\n');

    // Paste in editor supported format.
    for (let i = 0; i < data.length; i++) {
      const div = document.createElement('DIV');
      div.innerText = data[i];

      selection.getRangeAt(0).insertNode(div);
    }

    // Sync changes w/ cache.
    textarea.value = self.content.innerText;
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

  /**
   * Markdown tags, by name.
   *
   * @return {String}
   */
  function mHeading(value) {
    return '# ' + value;
  }

  function mBold(value) {
    return '**' + (value || ' ') + '**';
  }

  function mItalic(value) {
    return '_' + (value || ' ') + '_';
  }

  function mBlockquote(value) {
    return '> ' + value;
  }

  function mOrderedList(value, num = 1) {
    return num + '. ' + value;
  }

  function mUnorderedList(value) {
    return '- ' + value;
  }

  function mCode(value) {
    return '`' + (value || ' ') + '`';
  }

  function mHorizontalRule() {
    return '---';
  }

  function mLink(value) {
    return '[' + (value || 'title') + '](https://www.example.com)';
  }

  function mImage(value) {
    return '![' + (value || 'alt text') + '](image.jpg)';
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
