#!/usr/bin/env node
/* eslint-disable */

const Mercury = require('./dist/mercury');
const argv = require('yargs-parser')(process.argv.slice(2));

const {
  _: [url],
  format,
  f,
  extend,
  e,
} = argv;
(async (urlToParse, contentType, extendedTypes) => {
  if (!urlToParse) {
    console.log(
      '\n\
mercury-parser\n\n\
    The Mercury Parser extracts semantic content from any url\n\n\
Usage:\n\
\n\
    $ mercury-parser url-to-parse [--format=html|text|markdown] [--extend type=selector]... \n\
\n\
'
    );
    return;
  }
  try {
    const contentTypeMap = {
      html: 'html',
      markdown: 'markdown',
      md: 'markdown',
      text: 'text',
      txt: 'text',
    };
    const extensions = {};
    [].concat(extendedTypes).forEach(t => {
      [name, selector] = t.split('=');
      extensions[name] = { selectors: [selector], defaultCleaner: false };
    });
    const result = await Mercury.parse(urlToParse, {
      contentType: contentTypeMap[contentType],
      extend: extensions,
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    if (e.message === 'ETIMEDOUT' && false) {
      console.error(
        '\nMercury Parser encountered a timeout trying to load that resource.'
      );
    } else {
      console.error(
        '\nMercury Parser encountered a problem trying to parse that resource.\n'
      );
      console.error(e);
    }
    const reportBug =
      'If you believe this was an error, please file an issue at:\n\n    https://github.com/postlight/mercury-parser/issues/new';
    console.error(`\n${reportBug}\n`);
    process.exit(1);
  }
})(url, format || f, extend || e);
