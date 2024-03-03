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
 * @param {Element} container
 *   Containing HTML element.
 *
 * @param {Object} settings
 *   Editor settings.
 */
function TextMarked(container, settings) {
  const self = this;

  (function() {
    if (settings) {

    } else {
      throw new Error('Failed to initialize (missing settings)');
    }
  })();
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
