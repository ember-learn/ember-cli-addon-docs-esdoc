'use strict';

const fs = require('fs-extra');
const path = require('path');
const resolve = require('resolve');
const CachingWriter = require('broccoli-caching-writer');

const generateESDocJsonApi = require('../preprocessors/generate-esdoc-jsonapi');

module.exports = class DocsGenerator extends CachingWriter {
  constructor(inputNodes, options) {
    let defaults = {
      cacheInclude: [/\.(?:js|ts)$/],
    };

    super([inputNodes], Object.assign(defaults, options));

    this.project = options.project;
    this.destDir = options.destDir;
    this.packages = options.packages;
  }

  build() {
    let json = this.packages.reduce((memo, packageName) => {
      let packageJson;
      if (this.project.name() === packageName) {
        packageJson = generateESDocJsonApi(this.inputPaths[0]);
      } else {
        let name, dir;
        if (typeof packageName === 'object') {
          name = packageName.name;
          dir = packageName.sourceDirectory;
        } else {
          name = packageName;
          dir = '';
        }
        let pathToPackageJson = resolve.sync(`${name}/package.json`, {
          basedir: this.project.root,
        });
        let pathToPackage = path.dirname(pathToPackageJson);
        packageJson = generateESDocJsonApi(path.join(pathToPackage, dir));
      }

      memo.data = memo.data || [];
      if (packageJson.data) {
        memo.data.push(...packageJson.data);
      }

      memo.included = memo.included || [];
      if (packageJson.included) {
        memo.included.push(...packageJson.included);
      }

      return memo;
    }, {});

    fs.ensureDirSync(path.join(this.outputPath, this.destDir));
    fs.writeJsonSync(
      path.join(this.outputPath, this.destDir, 'index.json'),
      json,
      'utf-8'
    );
  }
};
