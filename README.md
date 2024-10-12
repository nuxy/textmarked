# textmarked

[![npm version](https://badge.fury.io/js/textmarked.svg)](https://badge.fury.io/js/textmarked) [![](https://img.shields.io/npm/dm/textmarked)](https://www.npmjs.com/package/textmarked) [![Build Status](https://img.shields.io/github/actions/workflow/status/nuxy/textmarked/.github%2Fworkflows%2Fci.yml)](https://app.travis-ci.com/github/nuxy/textmarked) [![Install size](https://packagephobia.com/badge?p=textmarked)](https://packagephobia.com/result?p=textmarked) [![](https://img.shields.io/github/v/release/nuxy/textmarked)](https://github.com/nuxy/textmarked/releases)

Enable Markdown editing in HTML `<textarea />`

![Preview](https://raw.githubusercontent.com/nuxy/textmarked/master/package.png)

## Features

- Extensible HTML/CSS interface.
- Drop-in replacement for existing input element.
- Scales to match `TEXTAREA` element dimensions.
- Easy to set-up and customize. **No dependencies**.

Checkout the [demo](https://nuxy.github.io/textmarked) for examples of use.

## Dependencies

- [Node.js](https://nodejs.org)

## Installation

Install the package into your project using [NPM](https://npmjs.com), or download the [sources](https://github.com/nuxy/textmarked/archive/master.zip).

    $ npm install textmarked

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
  allowKeys: `a-z0-9\\s,.?!$%&()\\[\\]"'-_#*\`>`,
  allowEnter: true,
  clipboard: false,
  showExample: true,
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

textMarked(textarea, settings).focus();
```

## Supported elements

[Heading](https://www.markdownguide.org/basic-syntax/#headings), [Bold](https://www.markdownguide.org/basic-syntax/#bold), [Italic](https://www.markdownguide.org/basic-syntax/#italic),
[Blockquote](https://www.markdownguide.org/basic-syntax/#blockquotes-1), [Ordered-List](https://www.markdownguide.org/basic-syntax/#ordered-lists), [Unordered-List](https://www.markdownguide.org/basic-syntax/#unordered-lists), [Code](https://www.markdownguide.org/basic-syntax/#code), [Horizontal-Rule](https://www.markdownguide.org/basic-syntax/#horizontal-rules), [Link](https://www.markdownguide.org/basic-syntax/#links), [Image](https://www.markdownguide.org/basic-syntax/#images-1)

## Editor settings

Overriding defaults can be done using the following options:

| Key         | Description                     | Type    | Default |
|-------------|---------------------------------|---------|---------|
| allowKeys   | Support keyboard characters ([REGEX](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes)) | String | ``a-z0-9\\s,.?!$%&()\\[\\]"'-_#*\`>`` |
| allowEnter  | Allow keyboard carriage return. | Boolean | false |
| clipboard   | Enable clipboard functionality. | Boolean | false |
| showExample | Show Markdown example in title. | Boolean | false |
| options     | List of [Supported elements](#supported-elements). | Array | **all elements** |

## Developers

### CLI options

Run [ESLint](https://eslint.org) on project sources:

    $ npm run lint

Transpile ES6 sources (using [Babel](https://babeljs.io)) and minify to a distribution:

    $ npm run build

Run [WebdriverIO](https://webdriver.io) E2E tests:

    $ npm run test

## References

- [Markdown basic syntax](https://www.markdownguide.org/cheat-sheet/#basic-syntax)
- [Lineicons project](https://github.com/LineiconsHQ/Lineicons)

## Versioning

This package is maintained under the [Semantic Versioning](https://semver.org) guidelines.

## License and Warranty

This package is distributed in the hope that it will be useful, but without any warranty; without even the implied warranty of merchantability or fitness for a particular purpose.

_textmarked_ and [Lineicons](https://github.com/LineiconsHQ/Lineicons) are provided under the terms of the [MIT license](http://www.opensource.org/licenses/mit-license.php)

## Author

[Marc S. Brooks](https://github.com/nuxy)
