'use strict';

import {browser, expect, $} from '@wdio/globals';
import {Key}                from 'webdriverio'

describe('Editor options', function() {
  let editor;

  beforeEach(async function() {
    await browser.url(`${process.cwd()}/demo/index.html`);

    editor = await $('.textmarked');
  });

  describe('Buttons', function() {
    const options = [
      {
        name: 'Heading',
        output: '#'
      },
      {
        name: 'Bold',
        output: '** **'
      },
      {
        name: 'Italic',
        output: '_ _'
      },
      {
        name: 'Blockquote',
        output: '>'
      },
      {
        name: 'Ordered-List',
        output: '1.'
      },
      {
        name: 'Unordered-List',
        output: '-'
      },
      {
        name: 'Code',
        output: '` `'
      },
      {
        name: 'Horizontal-Rule',
        output: '---'
      },
      {
        name: 'Link',
        output: '[title](https://www.example.com)'
      },
      {
        name: 'Image',
        output: '![alt text](image.jpg)'
      }
    ];

    it('should contain attributes', async function() {
      const buttons = await editor.$$('li');

      for (let i = 0; i < buttons.length; i++) {
        const button  = buttons[i];
        const optName = options[i].name;

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
        const output = options[i].output;

        const content = await editor.$('.content');

        await browser.action('pointer')
          .move({duration: 0, origin: content})
          .down({button: 0})
          .pause(2)
          .up({button: 0})
          .perform();

        await expect(button).toBeClickable();

        await button.click();

        await expect(content).toHaveText(output);

        await $('input[type=reset]').click();
      }
    });
  });
});
