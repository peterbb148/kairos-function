const dateformat = require('dateformat');

class KairosDocument {
  constructor(source, name, document, version = '1.0') {
    const now = new Date();
    this.header = {
      timestamp: now.toISOString(),
      source: source,
      version: version,
      documentName: name,
      date: dateformat(now, 'yyyy-mm-dd')
    };
    this.document = document;
  }
}

module.exports = KairosDocument;
