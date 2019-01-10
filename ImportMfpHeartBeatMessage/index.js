const _ = require('lodash');
const KairosDocument = require('../common/KairosDocument');

async function importMfpHeartBeatMessage(context, req) {

  if (_.isNil(req.body)) {
    context.res = {
      status: 400,
      body: 'Please supply a body.'
    };
    return undefined;
  }

  return new KairosDocument('MFP', 'MfpHeartBeatMessage', req.body, '1.0');
}

module.exports = importMfpHeartBeatMessage;
