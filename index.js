'use strict';

module.exports = {
  name: 'ember-cli-addon-docs-esdoc',

  createDocsGenerator(inputTree, options) {
    const ESDocGenerator = require('./lib/broccoli/generator');

    return new ESDocGenerator([inputTree], options)
  }
};
