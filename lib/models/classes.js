'use strict';

const _ = require('lodash');

const extractExportType = require('./utils/module').extractExportType;
const extractFile = require('./utils/module').extractFile;

const joinTypes = require('./utils/type').joinTypes;
const ParamParser = require('./utils/param-parser');

class Class {
  constructor(doc) {
    this.id = doc.longname;

    // Attributes
    this.name = doc.name;
    this.file = extractFile(doc);
    this.exportType = extractExportType(doc);
    this.description = doc.description;
    this.lineNumber = doc.lineNumber;
    this.access = doc.access;
    this.isInterface = doc.interface;

    this.decorators = doc.decorators || [];
    this.tags = doc.unknown ? doc.unknown.map(t => ({ name: t.tagName.replace(/^@/, ''), value: t.tagValue })) : [];
    this.fields = [];
    this.methods = [];
    this.accessors = [];

    // Relationships
    this.parentClassId = doc.extends ? doc.extends[0] : null;
  }

  static detect(doc) {
    return doc.kind === 'class' || (_.remove(doc.unknown || [], { tagName: '@class' }).length > 0);
  }
}

class Component extends Class {
  constructor(doc) {
    super(doc);
    this.type = 'component';

    // Attributes
    this.arguments = [];
    this.yields = _.remove(this.tags, { name: 'yield' }).map((tag) => {
      let param = ParamParser.parseParamValue(tag.value);
      let result = ParamParser.parseParam(param.typeText, param.paramName, param.paramDesc);

      result.type = joinTypes(result);
      delete result.types;

      return result;
    });
  }

  static detect(doc) {
    return super.detect(doc) && doc.memberof.match(/components\//) !== null;
  }
}

module.exports = { Class, Component };
