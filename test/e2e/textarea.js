'use strict';

import {browser, expect, $} from '@wdio/globals';

describe('Editor textarea', function() {
  let editor;

  beforeEach(async function() {
    await browser.url(`${process.cwd()}/demo/index.html`);

    editor = await $('.textmarked');
  });

  describe('Content', function() {
    it('should contain attributes', async function() {
      const textarea = await editor.$('.content');

      await expect(textarea).toHaveAttribute('contenteditable', 'true', {
        message: `Attribute contenteditable="true" is defined`
      });

      await expect(textarea).toHaveAttribute('tabindex', '11', {
        message: `Attribute tabindex="11" is defined`
      });

      await expect(textarea).toHaveAttribute('aria-label', 'Content editor', {
        message: 'Attribute aria-label="Content editor" is defined'
      });

      await expect(textarea).toHaveAttribute('role', 'textbox', {
        message: 'Attribute role="textbox" is defined'
      });
    });

    it('should handle events', async function() {
      const textarea = await editor.$('.content');

      await expect(textarea).toBeClickable();
    });
  });
});
