const path = require('path');
const express = require('express');
const router = express.Router();
const db = require('../db');
const { get } = require('axios');
/**
 * CUVita Server Side Implementations - Member
 * @author relubwu
 * @version 0.1.5
 * @copyright  © CHINESE UNION 2019
 */

const {
  FXML_URL,
  FXML_USERNAME,
  FXML_APIKEY
} = require(path.join(__dirname, 'config', 'fxmlconfig.json'));
const COLLECTION_NAME_ARRIVAL_ENV = 'arrival-env';

router.use(require('body-parser').json());

router.get('/layout', async(req, res) => {
  return res.json((await db.findOne(COLLECTION_NAME_ARRIVAL_ENV, { role: 'layoutConfiguration' }, { "_id": 0, "entries": 1 })).entries);
})

router.post('/pickup', async ({ body }, res) => {

});

router.get('/fetchFlightDetail', async ({ query :{ flight } }, res) => {
  if (!flight)
    return res.sendStatus(400);
  flight = flight.toUpperCase();
  if (!flight.match(/[A-Z]{2,3}\d+/g))
    return res.sendStatus(400);
  let airline, flightno;
  airline = flight.match(/[A-Z]{2,3}/g)[0];
  flightno = flight.match(/\d+/g)[0];
  let {
    actual_ident,
    departuretime,
    arrivaltime,
    origin,
    destination
  } = (await get(FXML_URL, {
    auth: {
      username: FXML_USERNAME,
      password: FXML_APIKEY
    },
    params: {
      airline,
      flightno,
      startDate: 1554102000,
      endDate: 1554188400,
      howMany: 1
    }
  })).data.AirlineFlightSchedulesResult.data[0];
  res.json(destination);

})

module.exports = router;
