'use strict';

import {browser, expect, $} from '@wdio/globals';

describe('Editor options', function() {
  let editor;

  beforeEach(async function() {
    await browser.url(`${process.cwd()}/demo/index.html`);

    editor = await $('.textmarked');
  });

  describe('Buttons', function() {
    const options = [
      'Heading',
      'Bold',
      'Italic',
      'Blockquote',
      'Ordered-List',
      'Unordered-List',
      'Code',
      'Horizontal-Rule',
      'Link',
      'Image'
    ];

    it('should contain attributes', async function() {
      const buttons = await editor.$$('li');

      for (let i = 0; i < buttons.length; i++) {
        const button  = buttons[i];
        const optName = options[i];

        const className = `icon ${optName}`;
        const tabindex  = (i + 1).toString();

        await expect(button).toHaveAttribute('class', className, {
          message: `Attribute class="${className}" is defined`
        });

        await expect(button).toHaveAttribute('tabindex', tabindex, {
          message: `Attribute tabindex="${tabindex}" is defined`
        });

        await expect(button).toHaveAttribute('title', optName, {
          message: `Attribute title="${optName}" is defined`
        });
      }
    });

    it('should handle events', async function() {
      const buttons = await editor.$$('li');

      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];

        await expect(button).toBeClickable();
      }
    });
  });
});
