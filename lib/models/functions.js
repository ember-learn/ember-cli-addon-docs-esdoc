'use strict';

const _ = require('lodash');
const EmbeddedDocumentModel = require('./base-classes/embedded-document');

const extractExportType = require('./utils/module').extractExportType;

const joinTypes = require('./utils/type').joinTypes;
const joinTypesInPlace = require('./utils/type').joinTypesInPlace

class BaseFunction extends EmbeddedDocumentModel {
  constructor(doc) {
    super(doc);

    this.returns = doc.return ? {
      type: joinTypes(doc.return),
      description: doc.return.description,
      properties: joinTypesInPlace(doc.properties)
    } : null;

    this.params = joinTypesInPlace(doc.params);
    this.isAsync = doc.async;
    this.isGenerator = doc.generator;
  }
}

class Function extends BaseFunction {
  constructor(doc) {
    super(doc);

    this.exportType = extractExportType(doc);
  }

  static detect(doc) {
    return doc.kind === 'function' || (_.remove(doc.unknown || [], { tagName: '@function' }).length > 0);
  }
}

class Method extends BaseFunction {
  constructor(doc) {
    super(doc);
    this.type = 'method';

    this.isStatic = doc.static;
    this.decorators = doc.decorators || [];
  }

  static detect(doc) {
    return doc.kind === 'method';
  }
}

class Helper extends Function {
  constructor(doc) {
    super(doc);
    this.type = 'helper';
  }

  static detect(doc) {
    return super.detect(doc) && doc.memberof.match(/\/helpers\//) !== null;
  }
}

module.exports = { Function, Method, Helper };
