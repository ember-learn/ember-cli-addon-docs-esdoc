'use strict';

class Module {
  constructor(doc) {
    this.id = doc.name;
    this.type = 'module';

    // Attributes
    this.file = doc.name;
    this.functions = [];
    this.helpers = [];
    this.variables = [];

    // Relationships
    this.classes = [];
    this.components = [];
  }
}

module.exports = Module;
