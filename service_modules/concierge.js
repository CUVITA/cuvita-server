const path = require('path');
const Database = require(path.join(__dirname, '..', '..', '.common','db.js'));
const axios = require('axios');
const router = require('express').Router();

/**
 * CUVita Server Side Implementations - Concierge API
 * @author relubwu
 * @version 0.2.1
 * @copyright  © CHINESE UNION 2019
 */

router.get('/passenger-detail', async ({ query: { name, flightNo } }, res) => {
  if (!name || !flightNo)
    return res.sendStatus(400);
  return res.json(await Database.findOne('concierge', {
    name,
    ['itinerary.flightNo']: flightNo
  }, {
    _id: 0
  }));
});

router.get('/correspondent-detail', async ({ query: { name } }, res) => {
  if (!name)
    return res.sendStatus(400);
});

module.exports = router;
