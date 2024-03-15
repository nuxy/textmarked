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
        output: '# ',
        example: '# Heading',
      },
      {
        name: 'Bold',
        output: '** **',
        example: '**Bold**'
      },
      {
        name: 'Italic',
        output: '_ _',
        example: '_Italic_'
      },
      {
        name: 'Blockquote',
        output: '> ',
        example: '> Blockquote'
      },
      {
        name: 'Ordered-List',
        output: '1. ',
        example: '1. Ordered-List'
      },
      {
        name: 'Unordered-List',
        output: '- ',
        example: '- Unordered-List'
      },
      {
        name: 'Code',
        output: '` `',
        example: '`Code`'
      },
      {
        name: 'Horizontal-Rule',
        output: '---',
        example: '---'
      },
      {
        name: 'Link',
        output: '[title](https://www.example.com)',
        example: '[title](https://www.example.com)'
      },
      {
        name: 'Image',
        output: '![alt text](image.jpg)',
        example: '![alt text](image.jpg)'
      }
    ];

    it('should contain attributes', async function() {
      const buttons = await editor.$$('li');

      for (let i = 0; i < buttons.length; i++) {
        const button  = buttons[i];
        const optName = options[i].name;
        const example  = options[i].example;

        const className = `icon ${optName}`;
        const tabindex  = (i + 1).toString();

        await expect(button).toHaveAttribute('class', className, {
          message: `Attribute class="${className}" is defined`
        });

        await expect(button).toHaveAttribute('tabindex', tabindex, {
          message: `Attribute tabindex="${tabindex}" is defined`
        });

        await expect(button).toHaveAttribute('title', example, {
          message: `Attribute title="${example}" is defined`
        });

        await expect(button).toHaveAttribute('aria-label', optName, {
          message: `Attribute aria-label="${optName}" is defined`
        });

        await expect(button).toHaveAttribute('role', 'button', {
          message: 'Attribute role="button" is defined'
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

        await expect(content).toHaveText(output.trim());

        await $('input[type=reset]').click();
      }
    });
  });
});
