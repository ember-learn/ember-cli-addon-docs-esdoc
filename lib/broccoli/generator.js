'use strict';

const fs = require('fs-extra');
const path = require('path');
const CachingWriter = require('broccoli-caching-writer');

const generateESDocJsonApi = require('../preprocessors/generate-esdoc-jsonapi');

module.exports = class DocsGenerator extends CachingWriter {
  constructor(inputNodes, options) {
    let defaults = {
      cacheInclude: [/\.(?:js|ts)$/]
    };

    super(inputNodes, Object.assign(defaults, options));

    this.project = options.project;
    this.destDir = options.destDir;
  }

  build() {
    let project = this.project;
    let json = generateESDocJsonApi(this.inputPaths[0], project);

    fs.ensureDirSync(path.join(this.outputPath, this.destDir));
    fs.writeJsonSync(path.join(this.outputPath, this.destDir, 'index.json'), json, 'utf-8');
  }
};
