const router = require('express').Router();
const axios = require('axios');
const validator = require('express-validator');
const flightDesignator = require('flight-designator');
const credentials = require(`${ process.cwd() }/config/credentials.json`);
const database = require(`${ process.cwd() }/utils/database`);

/**
 * CUVita Server Side Implementations - Concierge API
 * @author relubwu
 * @version 0.2.2
 * @copyright  © CHINESE UNION 2019
 */

const extendedHours = 5;
const limit = 5;

router.use(require('body-parser').json());

router.get('/flight/:flightNumber/:departTime/:timeZoneoffset', validator.param(['departTime', 'timeZoneoffset']).toInt(), async ({ params: { flightNumber, departTime, timeZoneoffset } }, res) => {
  if (!flightDesignator.isValid(flightNumber)) return res.status(400).end();
  departTime = new Date(departTime);
  let flight = new flightDesignator().parse(flightNumber);
  departTime.setMinutes(departTime.getMinutes() + timeZoneoffset);
  let startDate = Math.round(departTime.getTime() / 1000), endDate = new Date(departTime);
  endDate.setHours(endDate.getHours() + extendedHours);
  endDate = Math.round(endDate.getTime() / 1000);
  let { data: { AirlineFlightSchedulesResult: { data } } } = await axios.get(`${ credentials.fxml_url }/AirlineFlightSchedules`, { auth: { username: credentials.fxml_username, password: credentials.fxml_key }, params: { startDate, endDate, airline: flight.airlineCode, flightno: flight.flightNumber, howMany: limit, offset: 0 } });
  for (let index in data) {
    data[index].departuretime = new Date(data[index].departuretime * 1000).toLocaleString();
    data[index].arrivaltime *= 1000;
    if (data[index].destination !== 'KLAX' && data[index].destination !== 'KSFO') return res.status(404).end();
  }
  return data.length === 0 ? res.status(404).end() : res.json(data);
});

router.get('/destination/:depart', async({ params: depart }, res) => {
  let schedules = await database.find('schedules');
  let destinations = {};
  for (let schedule of schedules)
    if (!destinations[schedule.destination]) destinations[schedule.destination] = true;
  destinations = Object.keys(destinations);
  for (let index in destinations) {
    destinations[index] = await database.findOne('schools', { alias: destinations[index] }, { projection: { "_id": 0 } });
  }
  return destinations.length === 0 ? res.status(404).end() : res.json(destinations);
});

router.get('/schedule/:depart-:destination/:departTime', validator.param('departTime').toInt(), async({ params: { depart, destination, departTime } }, res) => {
  departTime = new Date(departTime);
  let schedules = await database.find('schedules', { "depart.alias": new RegExp(depart, 'ig'), destination, departTime: { $gte: departTime } }, { sort: { "departTime": 1 }, limit: 3  });
  return schedules.length === 0 ? res.status(404).end() : res.json(schedules);
});

router.get('/schedule/:id', async ({ params: { id } }, res) => {
  let schedule = await database.findOne('schedules', { _id: database.ObjectId(id) });
  return schedule ? res.json(schedule) : res.status(404).end();
});

router.post('/stage', validator.body(['openid', 'schedule', 'flight']).exists(), async(req, res) => {
  if (validator.validationResult(req).errors.length) return res.status(400).end();
  let { body: { openid, schedule, flight } } = req;
  schedule = await database.findOne('schedules', { _id: database.ObjectId(schedule) });
  await database.updateOne('users', { openid }, { $set: { services: { concierge: { schedule, flight } } } });
  return res.status(200).end();
});

module.exports = router;
