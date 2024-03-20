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
    clipboard: false,
    showExample: false
  };

  const uiState = {
    buttons: [],
    content: null,
    selection: null
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
      uiState.content.textContent = '';
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
      li.classList.add('icon', 'disabled', name);
      li.setAttribute('aria-label', name);
      li.setAttribute('data-id', name);
      li.setAttribute('role', 'button');
      li.setAttribute('tabindex', i + 1);
      li.setAttribute('title', (settings?.showExample) ? mExample(name) : name);

      li.style.height = buttonXY + 'px';
      li.style.width  = buttonXY + 'px';

      li.addEventListener('mousedown', disableFocusEvent);

      ul.appendChild(li);

      uiState.buttons.push(li);
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

    _textarea.addEventListener('focus', contentFocusEvent);
    _textarea.addEventListener('keydown', keyDownEvent);
    _textarea.addEventListener('keyup', keyUpEvent);
    _textarea.addEventListener('mouseup', textSelectionEvent);
    _textarea.addEventListener('mouseout', textSelectionEvent);
    _textarea.addEventListener('copy', clipboardCopyEvent);
    _textarea.addEventListener('cut', clipboardCopyEvent);
    _textarea.addEventListener('paste', clipboardPasteEvent);

    uiState.content = _textarea;

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

    const isValidKey = new RegExp(`^[${chars}]{1}$`, 'i').test(key);

    if (isValidKey || key === 'Backspace' || (key === 'Enter' && settings?.allowEnter)) {
      return syncTextChanges(target);
    }

    // Disable unsupported.
    return event.preventDefault();
  }

  /**
   * Handle key events (keyup).
   *
   * @inheritdoc
   */
  function keyUpEvent(event) {
    const {target} = event;

    contentFocusEvent(event);
    textSelectionEvent(event);
    syncTextChanges(target);
  }

  /**
   * Handle button events (click).
   *
   * @inheritdoc
   */
  function buttonEvent(event) {
    const {target} = event;

    const selection = uiState.selection;

    if (!selection) {

      // Disable unsupported.
      return event.preventDefault();
    }

    const {nodes, start, end, count, value} = selection;
    const nodeTotal = nodes.length;
    const nodeFirst = nodes[0];
    const nodeLast  = nodes[nodeTotal -1];

    let padding = false;
    let counter = 1;

    // Apply Markdown to selected text.
    for (let i = 0; i < nodeTotal; i++) {
      const item = nodes[i];

      let markdown;

      if (count > 1) {

        // .. multi-line selection.
        switch (target.dataset.id) {
          case 'Blockquote':
            markdown = mBlockquote(item.data);
            padding = true;
          break;

          case 'Ordered-List':
            markdown = mOrderedList(item.data, counter++);
            padding = true;
          break;

          case 'Unordered-List':
            markdown = mUnorderedList(item.data);
            padding = true;
          break;

          default:
            markdown = item.data;
        }

        item.textContent = markdown;

      } else {

        // .. focused selection.
        switch (target.dataset.id) {
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
            padding  = true;
          break;

          case 'Link':
            markdown = mLink(value);
          break;

          case 'Image':
            markdown = mImage(value);
          break;
        }

        if (start < end) {

          // Range text, no break lines.
          item.textContent = replaceInStr(item.textContent, start, end, markdown);

        } else if (end > 0) {

          // Break line (BR) Tag.
          item.after(markdown);

        } else {

          // Empty line (no Tags).
          item.textContent = markdown;
        }
      }
    }

    // Pad select values with line breaks.
    if (padding) {
      nodeFirst.before(document.createElement('br'));
      nodeLast.after(document.createElement('br'));
    }

    syncTextChanges();

    uiState.selection = null;
  }

  /**
   * Handle text selection events (mouseup|mouseout).
   *
   * @inheritdoc
   */
  function textSelectionEvent(event) {
    const selection = window.getSelection();

    const {focusNode, focusOffset, anchorNode, anchorOffset} = selection;

    if (isContentEditable(focusNode)) {

      // Disable unsupported.
      return event.preventDefault();
    }

    const contents = uiState.content.childNodes;
    const nodeList = [];

    let isRange = false;

    // Extract range of #text nodes.
    for (let i = 0; i < contents.length; i++) {
      const node = contents[i];
      const item = (node.tagName === 'DIV')
        ? node.firstChild : node;

      const breakOffset = (focusOffset === (i + 1));
      const isLineBreak = (item.tagName === 'BR');
      const isFirstText = (i === 1);

      if (item === focusNode) {
        isRange = true;
      }

      if (!isLineBreak && isRange || (isLineBreak && !isRange && breakOffset && !isFirstText)) {
        nodeList.push(item);
      }

      if (item === anchorNode) {
        isRange = false;
      }
    }

    const value = selection.toString();

    uiState.selection = {
      nodes: (nodeList.length) ? nodeList : [focusNode],

      // .. inverted selections.
      start: (focusOffset > anchorOffset) ? anchorOffset : focusOffset,
      end:   (focusOffset < anchorOffset) ? anchorOffset : focusOffset,

      // .. highlighted rows.
      count: value.split(/\n/).length,

      value
    };

    contentFocusEvent(event);
  }

  /**
   * Handle cliboard copy/cut events.
   *
   * @inheritdoc
   */
  function clipboardCopyEvent(event) {
    if (!settings.clipboard) {

      // Disable unsupported.
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
      const div = document.createElement('div');
      div.innerText = data[i];

      selection.getRangeAt(0).insertNode(div);
    }

    syncTextChanges();
  }

  /**
   * Handle content focus events.
   *
   * @inheritdoc
   */
  function contentFocusEvent(event) {
    const {target} = event;

    const buttons = uiState.buttons;

    // Toggle button availability.
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];

      if (target.textContent) {
        button.classList.remove('disabled');
        button.addEventListener('click', buttonEvent);
      } else {
        button.classList.add('disabled');
        button.removeEventListener('click', buttonEvent);
      }
    }
  }

  /**
   * Disable element focus events.
   *
   * @inheritdoc
   */
  function disableFocusEvent(event) {
    event.preventDefault();
  }

  /**
   * Synchronize contenteditable w/ TEXTAREA
   *
   * @param {Element} content
   *   Content editable element.
   */
  function syncTextChanges(content = uiState.content) {
    const contents = content.childNodes;

    for (let i = 0; i < contents.length; i++) {
      const content = contents[i];

      if (content.tagName === 'DIV') {
        const nodeFirst = content.firstChild;
        const nodeLast  = content.lastChild;

        content.replaceWith(nodeFirst);

        if (nodeLast && nodeLast.tagName !== 'BR') {
          nodeLast.after(document.createElement('BR'));
        }
      }
    }

    textarea.value = content.innerText;
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
   * Check is Node/Element is editable.
   *
   * @param {Node|Element} elm
   *   Instance of element.
   *
   * @return {Boolean}
   */
  function isContentEditable(elm) {
    return elm && ((elm.contenteditable || elm.parentNode.contenteditable));
  }

  /**
   * Return Markdown usage example.
   *
   * @param {String} name
   *   Markdown element name.
   *
   * @return {String|undefined}
   */
  function mExample(name) {
    switch (name) {
      case 'Heading':
        return mHeading(name);

      case 'Bold':
        return mBold(name);

      case 'Italic':
        return mItalic(name);

      case 'Blockquote':
        return mBlockquote(name);

      case 'Ordered-List':
        return mOrderedList(name);

      case 'Unordered-List':
        return mUnorderedList(name);

      case 'Code':
        return mCode(name);

      case 'Horizontal-Rule':
        return mHorizontalRule();

      case 'Link':
        return mLink();

      case 'Image':
        return mImage();
    }
  }

  /**
   * Return Markdown tagged output.
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

  function mHorizontalRule(value) {
    return value || '---';
  }

  function mLink(value) {
    return '[' + (value || 'title') + '](https://www.example.com)';
  }

  function mImage(value) {
    return '![' + (value || 'alt text') + '](image.jpg)';
  }

  /**
   * Protected members.
   */
  self.focus = function() {
    uiState.content.focus();
  };

  return self;
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
