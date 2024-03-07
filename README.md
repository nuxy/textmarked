# textmarked

Enable Markdown editor in HTML `<textarea />`. :warning: Work In Progress :warning:

## Usage

There are two ways you can use this package.  One is by including the JavaScript/CSS sources directly.  The other is by importing the module into your component.

### Script include

After you [build the distribution sources](#cli-options) the set-up is fairly simple..

```html
<script type="text/javascript" src="path/to/textmarked.min.js"></script>
<link rel="stylesheet" href="path/to/textmarked.min.css" media="all" />

<script type="text/javascript">
  textMarked(textarea, settings);
</script>
```

### Module import

If your using a modern framework like [Aurelia](https://aurelia.io), [Angular](https://angular.io), [React](https://reactjs.org), or [Vue](https://vuejs.org)

```javascript
import TextMarked from 'textmarked';
import 'textmarked/dist/textmarked.css';

const textMarked = new TextMarked(textarea, settings);
```

### HTML markup

```html
<textarea id="comments" name="comments" cols="50" rows="10"></textarea>
```

### Example

```javascript
const settings = {
  allowKeys: `a-z0-9\\s,.?!$%&()"'`,
  allowEnter: true,
  options: [
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
  ]
};

const textarea = document.getElementById('comments');

const {content} = new TextMarked(textarea, settings);
content.focus();
```

## Supported elements

[Heading](https://www.markdownguide.org/basic-syntax/#headings), [Bold](https://www.markdownguide.org/basic-syntax/#bold), [Italic](https://www.markdownguide.org/basic-syntax/#italic),
[Blockquote](https://www.markdownguide.org/basic-syntax/#blockquotes-1), [Ordered-List](https://www.markdownguide.org/basic-syntax/#ordered-lists), [Unordered-List](https://www.markdownguide.org/basic-syntax/#unordered-lists), [Code](https://www.markdownguide.org/basic-syntax/#code), [Horizontal-Rule](https://www.markdownguide.org/basic-syntax/#horizontal-rules), [Link](https://www.markdownguide.org/basic-syntax/#links), [Image](https://www.markdownguide.org/basic-syntax/#images-1)

## Developers

### CLI options

Run [ESLint](https://eslint.org) on project sources:

    $ npm run lint

Transpile ES6 sources (using [Babel](https://babeljs.io)) and minify to a distribution:

    $ npm run build

Run [WebdriverIO](https://webdriver.io) E2E tests:

    $ npm run test

## References

- [Markdown basic Syntax](https://www.markdownguide.org/cheat-sheet/#basic-syntax)
- [Lineicons project](https://github.com/LineiconsHQ/Lineicons)
