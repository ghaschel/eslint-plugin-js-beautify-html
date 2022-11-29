# eslint-plugin-js-beautify-html

JS Beautify formatting through ESLint

This is an effort to provide an ESLint-integrated alternative to Prettier for HTML formatting.

## Table of contents

- [Installation](#installation)
- [Configuration](#configuration)
  - [.jsbeautifyrc file](#jsbeautifyrc-file)
  - [.eslintrc.js file](#eslintrcjs-file)
  - [ESLint's autofix](#eslints-autofix)
- [Rules](#rules)

## Installation

Run the following command:

```shell
npm install --save-dev eslint-plugin-js-beautify-html
```

## Configuration

The configuration is divided in two parts:

- JS-Beautify formatting rules: see [.jsbeautifyrc file](#jsbeautifyrc-file) and [.eslintrc.js file](#eslintrcjs-file)
- Enabling ESLint's autofix

### .jsbeautifyrc file

Simply create a `.jsbeautifyrc` file in the root of your project

```json
{
  "html": {
    "indent_with_tabs": false,
    "indent_size": 2,
    "max_preserve_newlines": 1,
    "preserve_newlines": true,
    "indent_inner_html": true,
    "wrap_attributes": "force-expand-multiline",
    "wrap_line_length": 120,
    "end_with_newline": true,
    "indent_scripts": "normal"
  }
}
```

And set this to your `eslintrc.js`

```javascript
module.exports = {
  ...
  overrides: [
    {
      files: ['*.html'],
      plugins: ['js-beautify-html'],
      rules: {
        ...
        'js-beautify-html/format': ['error', { useJsBeautifyRc: true }],
      },
    },
  ]
}
```

### .eslintrc.js file

This could also be done using only the `.eslintrc.js` file by setting this into your `.eslintrc.js` file:

```javascript
module.exports = {
  ...
  overrides: [
    {
      files: ['*.html'],
      plugins: ['js-beautify-html'],
      rules: {
        ...
        'js-beautify-html/format': [
          'error',
          {
            'indent_with_tabs': false,
            'indent_size': 2,
            'max_preserve_newlines': 1,
            'preserve_newlines': true,
            'indent_inner_html': true,
            'wrap_attributes': 'force-expand-multiline',
            'wrap_line_length': 120,
            'end_with_newline': true,
            'indent_scripts': 'normal'
          },
        ],
      },
    },
  ]
}
```

### ESLint's autofix

Insert the following configurations into your VSCode's `settings.json` file:

```json
{
  ...
  "eslint.options": {
    "extensions": [
        ".ts",
        ".html"
    ]
  },
  "eslint.validate": [
    "html",
    "javascript",
    "typescript",
    "javascriptreact",
    "typescriptreact"
  ],
  "[html]": {
    "editor.formatOnSave": false,
    "editor.codeActionsOnSave": {
        "source.fixAll": true
    }
  },
}
```

## Rules

The only available rule is: `js-beautify-html/format` and it is only a placeholder rule in order for JS-Beautify to format the HTML code on source fix.

Please bear in mind, that while the code is not formatted, an error will be displayed in the first character of the file (also in the problems tab if you're using ESLint's VSCode extension), with the description: `Code not formatted`.
