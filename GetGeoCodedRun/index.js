const _ = require('lodash');

async function getGeoCodedRun(context) {

  const {run, stops} = context.bindings;

  context.res.body = _.map(run[0].document.stops, (stop, index) => {
    const geoCoded = _.find(stops, {document: {id: stop.id}});
    return {
      id: stop.id,
      lat: geoCoded.document.latitude,
      lng: geoCoded.document.longitude,
      sequence: index + 1
    };
  });
}

module.exports = getGeoCodedRun;
