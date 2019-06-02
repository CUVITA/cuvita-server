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
  FXML_APIKEY,
  FXML_HOWMANY
} = require(path.join(__dirname, 'config', 'fxmlconfig.json'));
const COLLECTION_NAME_ARRIVAL_ENV = 'arrival-env';

router.use(require('body-parser').json());

router.get('/layout', async(req, res) => {
  return res.json((await db.findOne(COLLECTION_NAME_ARRIVAL_ENV, { role: 'layoutConfiguration' }, { "_id": 0, "entries": 1 })).entries);
})

router.post('/pickup', async ({ body }, res) => {

});

router.get('/fetchFlightDetail', async ({ query :{ flight, startDate } }, res) => {
  if (!flight || !startDate)
    return res.sendStatus(400);
  flight = flight.toUpperCase();
  if (!flight.match(/[A-Z]{2,3}\d+/g))
    return res.sendStatus(400);
  let endDate;
  try {
    startDate = new Date(parseInt(startDate));
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);
    startDate = startDate.getTime() / 1000;
    endDate = endDate.getTime() / 1000;
  } catch (e) {
    console.error(e);
    return res.sendStatus(400);
  }
  let airline, flightno;
  airline = flight.match(/[A-Z]{2,3}/g)[0];
  flightno = flight.match(/\d+/g)[0];
  let {
    data: {
      AirlineFlightSchedulesResult: {
        data
      }
    }
  } = (await get(FXML_URL, {
    auth: {
      username: FXML_USERNAME,
      password: FXML_APIKEY
    },
    params: {
      airline,
      flightno,
      startDate,
      endDate,
      howMany: FXML_HOWMANY
    }
  }));
  res.json(data);
})

module.exports = router;
