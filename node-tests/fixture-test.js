'use strict';

const fs = require('fs-extra');
const path = require('path');
const expect = require('chai').expect;
const generateESDocJsonApi = require('../lib/preprocessors/generate-esdoc-jsonapi');

const mockProject = {
  name() {
    return 'test-addon';
  },

  ui: {
    //eslint-disable-next-line
    writeWarnLine: console.warn
  },
};

describe('ember-cli-addon-docs-esdoc | fixture test', function () {
  let fixtureDirectories = fs.readdirSync(path.join(__dirname, 'fixtures'));

  for (let dir of fixtureDirectories) {
    it(dir, function () {
      let expectedOutput = fs.readJsonSync(
        path.join(__dirname, 'fixtures', dir, 'output.json')
      );
      let output = generateESDocJsonApi(
        path.resolve(__dirname, 'fixtures', dir, 'files'),
        mockProject
      );

      expect(JSON.parse(JSON.stringify(output))).to.deep.equal(expectedOutput);
    });
  }
});
