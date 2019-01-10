const _ = require('lodash');
const got = require('got');
const KairosDocument = require('../common/KairosDocument');

const hereUrl = 'https://geocoder.api.here.com/6.2/geocode.json';
const newRunMessageType = 'MfpRunMessage';
const geoCodedMessageType = 'GeoCodedStopMessage';
const commonHereOptions = {
  'app_id': process.env['here_app_id'],
  'app_code': process.env['here_app_code'],
  'jsonattributes': '1'
};

const isNotNil = _.negate(_.isNil);

async function geoCodeStops(context, documents) {
  const geoCodedStops = await Promise.all(
    _(documents)
      .filter({header: {documentName: newRunMessageType}})
      .groupBy('document.id')
      .mapValues(extractStops)
      .flatMap(geoCodeRun)
      .value()
  );
  return geoCodedStops.filter(isNotNil);
}

function extractStops(runMessage) {
  return _.flatMap(runMessage, 'document.stops');
}

function createMessage(runId, stopId) {
  return (position) => {
    if (_.isNil(position)) {
      return undefined;
    }
    return new KairosDocument(
      'ETA',
      geoCodedMessageType,
      {
        id: stopId,
        runId,
        ...position
      },
      '1.0'
    );
  }
}

function geoCodeRun(stops, runId) {

  async function geoCodeStop(stop) {
    return getStopPositions(stop)
      .then(getBestPosition)
      .then(createMessage(runId, stop.id));
  }

  return _.map(stops, geoCodeStop);
}

function getStopPositions(stop) {
  const query = {
    ...commonHereOptions,
    city: stop.address.city,
    country: stop.address.country,
    street: stop.address.street,
    houseNumber: stop.address.streetNumber
  };
  const json = true;
  return got(hereUrl, {query, json})
    .then(response => response.body);
}

function getBestPosition(hereResult) {
  const views = hereResult.response.view;
  if (_.isEmpty(views)) {
    return undefined;
  }
  return _(views[0].result)
    .orderBy('relevance', 'desc')
    .first()
    .location
    .navigationPosition[0];
}

module.exports = geoCodeStops;
