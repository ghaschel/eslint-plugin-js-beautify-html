/**
 * @file Runs `js-beautify` (only html supported) as an ESLint rule.
 * @author Guilherme Haschel
 */

// @ts-check

/**
 * @typedef {import('eslint').ESLint.Plugin} Plugin
 */

"use strict";

// ------------------------------------------------------------------------------
//  Privates
// ------------------------------------------------------------------------------

const jsBeautify = require("js-beautify");
const fs = require("fs");
const htmlParser = require('node-html-parser');

// ------------------------------------------------------------------------------
//  Module Definition
// ------------------------------------------------------------------------------

/**
 * @type {Plugin}
 */
const eslintPluginPrettier = {
  configs: {
    recommended: {
      plugins: ["js-beautify-html"],
      rules: {
        "js-beautify-html/format": ["error", { useJsBeautifyRc: true }],
      },
    },
  },
  rules: {
    format: {
      meta: {
        docs: {
          url: "https://github.com/ghaschel/eslint-plugin-js-beautify-html#configuration",
        },
        type: "layout",
        fixable: "code",
        hasSuggestions: true,
        schema: [
          {
            type: "object",
            properties: {
              useJsBeautifyRc: {
                type: "boolean",
              },
            },
            additionalProperties: false,
          },
          {
            type: "object",
            properties: {
              indent_with_tabs: {
                type: "boolean",
              },
              indent_size: {
                type: "number",
              },
              max_preserve_newlines: {
                type: "number",
              },
              preserve_newlines: {
                type: "boolean",
              },
              indent_inner_html: {
                type: "boolean",
              },
              wrap_attributes: {
                enum: [
                  "auto",
                  "force",
                  "force-aligned",
                  "force-expand-multiline",
                  "aligned-multiple",
                  "preserve",
                  "preserve-aligned",
                ],
              },
              wrap_line_length: {
                type: "number",
              },
              end_with_newline: {
                type: "boolean",
              },
              indent_scripts: {
                enum: ["separate", "normal", "keep"],
              },
            },
            additionalProperties: false,
          },
        ],
      },
      create(context) {
        const sourceCode = context.getSourceCode();
        const source = sourceCode.text;
        const node = context.getScope().block;
        const range = node.range ?? [0, 1];
        const useJsBeautifyRc =
          !context.options[1] || context.options[1].useJsBeautifyRc !== false;
        let jsBeautifyRc;

        if (useJsBeautifyRc) {
          const rcPath = `${context.getCwd()}/.jsbeautifyrc`;

          try {
            jsBeautifyRc = JSON.parse(fs.readFileSync(rcPath).toString()) || {};
          } catch (err) {
            throw Error(
              `Could not find .jsbeautifyrc file in ${context.getCwd()}`
            );
          }
        }

        jsBeautifyRc = jsBeautifyRc.html || context.options[1];

        if (!htmlParser.valid(source)) {
          return {
            Program() {
              context.report({
                node: context.getScope().block,
                message: "Unmatched tag in code",
                loc: {
                  line: 1,
                  column: 1,
                }
              });
            },
          };
        }

        const result = jsBeautify.html_beautify(source, {
          ...jsBeautifyRc,
        });

        return {
          Program() {
            if (source.trim() !== result.trim()) {
              context.report({
                node: context.getScope().block,
                message: "Code not formatted",
                loc: {
                  line: 1,
                  column: 1,
                },
                fix: function (fixer) {
                  return fixer.replaceTextRange([range[0], range[1]], result);
                },
              });
            }
          },
        };
      },
    },
  },
};

module.exports = eslintPluginPrettier;
