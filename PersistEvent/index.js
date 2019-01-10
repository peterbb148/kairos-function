const KairosDocument = require('../common/KairosDocument');

async function persistEvent(context, req) {
  return new KairosDocument(req.params.source, req.params.eventType, req.body);
}

module.exports = persistEvent;
