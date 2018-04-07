'use strict';

const _ = require('lodash');
const generateESDoc = require('./generate-esdoc');

const Module = require('../models/module');

const Class = require('../models/classes').Class;
const Component = require('../models/classes').Component;

const Function = require('../models/functions').Function;
const Method = require('../models/functions').Method;

const Variable = require('../models/variables').Variable;
const Field = require('../models/variables').Field;
const Argument = require('../models/variables').Argument;
const Accessor = require('../models/variables').Accessor;

const Serializer = require('../serializers/main');

function normalizePaths(doc) {
  if (doc.kind === 'file') {
    doc.name = doc.name ? doc.name.substr(doc.name.indexOf('/') + 1).replace(/\.js/, '') : undefined;
  } else {
    doc.longname = doc.longname ? doc.longname.substr(doc.longname.indexOf('/') + 1).replace(/\.js/, '') : undefined;
    doc.memberof = doc.memberof ? doc.memberof.substr(doc.memberof.indexOf('/') + 1).replace(/\.js/, '') : undefined;
    doc.importPath = doc.importPath ? doc.importPath.substr(doc.importPath.indexOf('/') + 1).replace(/\.js/, '') : undefined;
  }
}

function isModule(doc) {
  return doc.kind === 'file';
}

function isModuleDocument(doc) {
  return doc.kind === 'class' || doc.kind === 'function' || doc.kind === 'variable';
}

function isEmbeddedDocument(doc) {
  return doc.kind === 'method' || doc.kind === 'member' || doc.kind === 'get' || doc.kind === 'set';
}

module.exports = function generateESDocJsonApi(inputPath) {
  let docs = generateESDoc(inputPath);

  let modules = {};
  let klasses = {};

  for (let doc of docs) {
    normalizePaths(doc);

    if (isModule(doc)) {
      let module = new Module(doc);
      modules[module.id] = module;

    } else if (isModuleDocument(doc)) {
      let module = modules[doc.memberof];

      if (doc.export === false) continue;

      if (Component.detect(doc)) {
        let klass = new Component(doc);
        module.components.push(klass);
        klasses[klass.id] = klass;

      } else if (Class.detect(doc)) {
        let klass = new Class(doc)
        module.classes.push(klass);
        klasses[klass.id] = klass;

      } else if (Function.detect(doc)) {
        module.functions.push(new Function(doc));

      } else if (Variable.detect(doc)) {
        module.variables.push(new Variable(doc));
      }

    } else if (isEmbeddedDocument(doc)) {
      let klass = klasses[doc.memberof];

      if (doc.undocument === true && !Accessor.detect(doc)) continue;

      if (Method.detect(doc)) {
        klass.methods.push(new Method(doc));

      } else if (Accessor.detect(doc)) {
        let newAccessor = new Accessor(doc);
        let accessor = klass.accessors.find((a) => a.name === doc.name && a.isStatic === newAccessor.isStatic);

        if (accessor) {
          accessor.merge(newAccessor);
        } else {
          klass.accessors.push(newAccessor);
        }
      } else if (Argument.detect(doc)) {
        klass.arguments.push(new Argument(doc));

      } else if (Field.detect(doc)) {
        klass.fields.push(new Field(doc));
      }
    }
  }

  let includedModules = _.sortBy(_.values(modules), ['id']);

  return Serializer.serialize('module', includedModules);
};

