const router = require('express').Router();
const database = require(`${ process.cwd() }/utils/database`);
const validator = require('express-validator');
const nearestLocation = require('map-nearest-location');

/**
 * CUVita Server Side Implementations - Region API
 * @author relubwu
 * @version 0.2.2
 * @copyright  © CHINESE UNION 2019
 */

const maxDistance = 321868;

router.get('/nearest', validator.query(['lat', 'long']).exists().toFloat(), async (req, res) => {
  if (validator.validationResult(req).errors.length) return res.status(400).end();
  let { query: { lat, long } } = req;
  let regions = await database.find('regions');
  let locations = [];
  for (let region of regions)
    locations.push({ lat: region.geoLocation.lat, long: region.geoLocation.long });
  let { location, distance } = nearestLocation({ lat, long }, locations);
  if (distance > maxDistance) return res.status(404).end();
  return res.json(await database.findOne('regions', { geoLocation: { ...location } }, { projection: { "_id": 0, "region": 1 } }));
});

module.exports = router;
