const router = require('express').Router();
const credentials = require(`${ process.cwd() }/config/credentials.json`);
const database = require(`${ process.cwd() }/utils/database`);
const localhost = require(`${ process.cwd() }/utils/localhost`);
const axios = require('axios');
const validator = require('express-validator');
const flightDesignator = require('flight-designator');
const geolib = require('geolib');
const decodePolyline = require('decode-google-map-polyline');

/**
 * CUVita Server Side Implementations - Concierge API
 * @author relubwu
 * @version 0.2.3
 * @copyright  © CHINESE UNION 2019
 */

const extendedHours = 5;
const limit = 5;

router.use(require('body-parser').json());

router.get('/flight/:flightNumber/:departTime', validator.param(['departTime']).toDate(), async ({ params: { flightNumber, departTime, timeZoneoffset } }, res) => {
  if (!flightDesignator.isValid(flightNumber)) return res.status(400).end();
  let flight = new flightDesignator().parse(flightNumber);
  let startDate = Math.round(departTime.getTime() / 1000), endDate = Math.round(departTime.setDate(departTime.getDate() + 1) / 1000);
  console.log(departTime, endDate);
  let result = await axios.get(`${ credentials.fxml_url }/AirlineFlightSchedules`, { auth: { username: credentials.fxml_username, password: credentials.fxml_key }, params: { startDate, endDate, airline: flight.airlineCode, flightno: flight.flightNumber, howMany: limit, offset: 0 } });
  let { data: { AirlineFlightSchedulesResult: { data } } } = await axios.get(`${ credentials.fxml_url }/AirlineFlightSchedules`, { auth: { username: credentials.fxml_username, password: credentials.fxml_key }, params: { startDate, endDate, airline: flight.airlineCode, flightno: flight.flightNumber, howMany: limit, offset: 0 } });
  console.log({ startDate, endDate, airline: flight.airlineCode, flightno: flight.flightNumber, howMany: limit, offset: 0 });
  for (let index in data) {
    data[index].departuretime = new Date(data[index].departuretime * 1000).toUTCString();
    data[index].arrivaltime *= 1000;
    if (data[index].destination !== 'KLAX' && data[index].destination !== 'KSFO') return res.status(404).end();
  }
  return data.length === 0 ? res.status(404).end() : res.json(data);
});

router.get('/destination/:depart', async({ params: depart }, res) => {
  let schedules = await database.find('schedules');
  let destinations = {};
  for (let schedule of schedules)
    if (!destinations[schedule.destination.alias]) destinations[schedule.destination.alias] = schedule.destination;
  return res.json(destinations);
});

router.get('/schedule/:depart-:destination/:departTime', validator.param('departTime').toInt(), async({ params: { depart, destination, departTime } }, res) => {
  departTime = new Date(departTime);
  let schedules = await database.find('schedules', { "depart.alias": depart.toLowerCase(), "destination.alias": destination.toLowerCase(), departTime: { $gte: departTime } }, { sort: { "departTime": 1 }, limit: 3  });
  return res.json(schedules);
});

router.get('/schedule/:id', async ({ params: { id } }, res) => {
  let schedule = await database.findOne('schedules', { _id: database.ObjectId(id) });
  let locations = [`${ schedule.depart.location.coordinates[1] },${ schedule.depart.location.coordinates[0] }`, `${ schedule.destination.location.coordinates[1] },${ schedule.destination.location.coordinates[0] }`, `${ schedule.location.coordinates[1] },${ schedule.location.coordinates[0] }`];
  let stringifyLocations = '';
  for (let index in locations) {
    stringifyLocations += locations[index];
    if (index < locations.length - 1) stringifyLocations += ';';
  }
  let translatedCoordinates = (await localhost.get(`/region/translate/${ stringifyLocations }`)).data;
  schedule.depart.location = { lat: translatedCoordinates[0].lat, long: translatedCoordinates[0].lng };
  schedule.destination.location = { lat: translatedCoordinates[1].lat, long: translatedCoordinates[1].lng };
  schedule.location = { lat: translatedCoordinates[2].lat, long: translatedCoordinates[2].lng };
  switch (schedule.status) {
    case 'PENDING':
      schedule.map = schedule.depart.location;
      schedule.map.markers = [{id: 0, latitude: schedule.depart.location.lat, longitude: schedule.depart.location.long, iconPath: 'https://cuvita-1254391499.cos.na-siliconvalley.myqcloud.com/icons/bus.png', height: '30', width: '30', callout: { content: '接机集合点', color: '#000000', bgColor: '#ffffff', padding: '5', display: 'ALWAYS', borderRadius: '5' } }];
      break;
    case 'ENROUTE':
      let { latitude, longitude } = geolib.getCenter([ { latitude: schedule.depart.location.lat, longitude: schedule.depart.location.long }, { latitude: schedule.destination.location.lat, longitude: schedule.destination.location.long } ]);
      schedule.map = { lat: latitude.toFixed(5), long: longitude.toFixed(5) };
      schedule.map.markers = [{id: 0, latitude: schedule.location.lat, longitude: schedule.location.long, iconPath: 'https://cuvita-1254391499.cos.na-siliconvalley.myqcloud.com/icons/bus.png', height: '30', width: '30' }, {id: 1, latitude: schedule.destination.location.lat, longitude: schedule.destination.location.long, iconPath: 'https://cuvita-1254391499.cos.na-siliconvalley.myqcloud.com/icons/region_pin.png', height: '30', width: '30', callout: { content: schedule.destination.name[1], color: '#000000', bgColor: '#ffffff', padding: '5', display: 'ALWAYS', borderRadius: '5' } }];
      let vdist = Math.abs(schedule.location.lat - schedule.destination.location.lat);
      schedule.map.include = schedule.location.lat > schedule.destination.location.lat ? [ { latitude: schedule.location.lat + vdist * 0.1, longitude: schedule.location.long }, { latitude: schedule.destination.location.lat - vdist * 0.1, longitude: schedule.destination.location.long } ] : [ { latitude: schedule.location.lat - vdist * 0.1, longitude: schedule.location.long }, { latitude: schedule.destination.location.lat + vdist * 0.1, longitude: schedule.destination.location.long } ];
      let { data: { routes } } = await axios.get('https://maps.googleapis.com/maps/api/directions/json', { params: { origin: `${ schedule.location.lat },${ schedule.location.long }`, destination: `${ schedule.destination.location.lat },${ schedule.destination.location.long }`, key: credentials.googlemap_key } });
      schedule.map.polyline = [ { points: decodePolyline(routes[0].overview_polyline.points), color: '#00c250', width: 10, borderColor: '#ffbe00', borderWidth: 2 } ];
      schedule.arrivalTime = new Date();
      schedule.arrivalTime.setSeconds(new Date().getSeconds() + routes[0].legs[routes[0].legs.length - 1].duration.value);
      schedule.arrivalTime = schedule.arrivalTime.toISOString();
      schedule.hideLocation = true;
      break;
    case 'ARRIVED':
      schedule.map = schedule.destination.location;
      schedule.map.markers = [{id: 0, latitude: schedule.destination.location.lat, longitude: schedule.destination.location.long, iconPath: 'https://cuvita-1254391499.cos.na-siliconvalley.myqcloud.com/icons/region_pin.png', height: '30', width: '30', callout: { content: schedule.destination.name[1], color: '#000000', bgColor: '#ffffff', padding: '5', display: 'ALWAYS', borderRadius: '5' } }]
      break;
  }
  return schedule ? res.json(schedule) : res.status(404).end();
});

router.post('/stage', validator.body(['openid', 'schedule', 'flight']).exists(), async(req, res) => {
  if (validator.validationResult(req).errors.length) return res.status(400).end();
  let { body: { openid, schedule, flight } } = req;
  await database.updateOne('users', { openid }, { $set: { concierge: { schedule, flight } } });
  return res.status(200).end();
});

router.post('/report/:id', validator.body(['latitude, longitude']).exists().toFloat(), async(req, res) => {

});

module.exports = router;
