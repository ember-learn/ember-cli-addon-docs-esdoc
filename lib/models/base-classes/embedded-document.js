'use strict';

const extractFile = require('../utils/module').extractFile;

class EmbeddedDocumentModel {
  constructor(doc) {
    this.name = doc.name;
    this.description = doc.description;
    this.lineNumber = doc.lineNumber;
    this.access = doc.access;
    this.tags = doc.unknown
      ? doc.unknown.map((t) => ({
          name: t.tagName.replace(/^@/, ''),
          value: t.tagValue,
        }))
      : [];

    this.file = extractFile(doc);
  }
}

module.exports = EmbeddedDocumentModel;
