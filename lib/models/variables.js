'use strict';

const _ = require('lodash');
const EmbeddedDocumentModel = require('./base-classes/embedded-document');

const extractExportType = require('./utils/module').extractExportType;

const joinTypes = require('./utils/type').joinTypes;
const extractDecoratorType = require('./utils/type').extractDecoratorType;

class BaseVariable extends EmbeddedDocumentModel {
  constructor(doc) {
    super(doc);

    this.type = joinTypes(doc.type);
  }
}

class Variable extends BaseVariable {
  constructor(doc) {
    super(doc);

    this.exportType = extractExportType(doc);
  }

  static detect(doc) {
    return doc.kind === 'variable';
  }
}

class Field extends BaseVariable {
  constructor(doc) {
    super(doc);

    this.isStatic = doc.static;
    this.decorators = doc.decorators || [];
    this.type =
      extractDecoratorType(_.remove(this.decorators, { name: 'type' })[0]) ||
      this.type;
  }

  static detect(doc) {
    return doc.kind === 'member';
  }
}

class Accessor extends Field {
  constructor(doc) {
    super(doc);

    this.hasGetter = doc.kind === 'get';
    this.hasSetter = doc.kind === 'set';
  }

  static detect(doc) {
    return doc.kind === 'get' || doc.kind === 'set';
  }

  merge(accessor) {
    // Merged so we definitely have both a getter and a setter
    this.hasGetter = true;
    this.hasSetter = true;

    this.tags = this.tags.concat(accessor.tags);
    this.decorators = this.decorators.concat(accessor.decorators);
  }
}

class Argument extends Field {
  static detect(doc) {
    return (
      super.detect(doc) &&
      !!(
        (doc.unknown && doc.unknown.find((u) => u.tagName === '@argument')) ||
        (doc.decorators && doc.decorators.find((d) => d.name === 'argument'))
      )
    );
  }
}

module.exports = { Variable, Field, Accessor, Argument };
