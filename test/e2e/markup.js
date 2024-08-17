'use strict';

import {browser, expect, $} from '@wdio/globals';

describe('HTML output', function() {
  let editor;

  beforeEach(async function() {
    await browser.url(`${process.cwd()}/demo/index.html`);

    editor = await $('.textmarked');
  });

  describe('Content', function() {
    const text = `
# The Raven

> But the raven, sitting lonely on the placid bust, spoke only That one word, as if his soul in that one word he did outpour.

Ravens in \`stories\` often act as [psychopomps](https://en.wikipedia.org/wiki/Psychopomp), connecting the **material world** with the *world of spirits*.

---

![Raven](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Head_of_Raven.jpg/1920px-Head_of_Raven.jpg)
    `;

    it('should have value', async function() {
      await editor.$('.content').addValue(text);

      const output = await $('#output').getHTML();

      await expect(output).toMatch('<h1>The Raven</h1>');
      await expect(output).toMatch('<blockquote>But the raven, sitting lonely on the placid bust, spoke only That one word, as if his soul in that one word he did outpour.</blockquote>');
      await expect(output).toMatch('<code>stories</code>');
      await expect(output).toMatch('<a href="https://en.wikipedia.org/wiki/Psychopomp">psychopomps</a>');
      await expect(output).toMatch('<strong>material world</strong>');
      await expect(output).toMatch('<em>world of spirits</em>')
      await expect(output).toMatch('<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Head_of_Raven.jpg/1920px-Head_of_Raven.jpg" alt="Raven">');
    });
  });
});
