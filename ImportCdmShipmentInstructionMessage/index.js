const _ = require('lodash');
const KairosDocument = require('../common/KairosDocument');
const xml2js = require('xml2js');
const xml2jsParser = require('xml2js-es6-promise')

async function importCdmShipmentInstructionMessage(context, req) {

  if (_.isNil(req.body)) {
    context.res = {
      status: 400,
      body: 'Please supply a body.'
    };
    return undefined;
  }

  const stripNameSpaceProcessor = xml2js.processors.stripPrefix;

  try {
    const json = await xml2jsParser(req.body, {
      tagNameProcessors: [stripNameSpaceProcessor],
      explicitCharkey: true,
      explicitArray: false,
      attrkey: '@attr',
      charkey: '$text'
    });
    return new KairosDocument('ESB', 'CdmShipmentInstructionMessage', json, '1.0');
  } catch (err) {
    context.res = {
      status: 400,
      body: "Parsing error occurred. Parser error :\n" + err
    };
    return undefined;
  }
}

module.exports = importCdmShipmentInstructionMessage;
