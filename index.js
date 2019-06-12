'use strict';

module.exports = {
  name: 'ember-cli-addon-docs-esdoc',

  createDocsGenerator(inputTree, options) {
    const Generator = require('./lib/broccoli/generator');
    let emberCliAddonDocsEsdocOptions = this.app.options['ember-cli-addon-docs-esdoc'] || {};

    return new Generator(inputTree, {
      project: this.project,
      destDir: options.destDir,
      packages: emberCliAddonDocsEsdocOptions.packages || [ this.project.name() ]
    });
  }
};
