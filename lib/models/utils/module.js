function extractExportType(doc) {
  if (doc.importStyle) {
    return doc.importStyle.match(/{.+}/) !== null ? 'named' : 'default';
  }

  return 'none';
}

function extractFile(doc) {
  return doc.longname.split('~')[0];
}

module.exports = { extractExportType, extractFile };
