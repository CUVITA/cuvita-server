const router = require('express').Router();
const axios = require('axios')
const database = require(`${ process.cwd() }/utils/database`);
const validator = require('express-validator');
const credentials = require(`${ process.cwd() }/config/credentials.json`);
const nearestLocation = require('map-nearest-location');

/**
 * CUVita Server Side Implementations - Region API
 * @author relubwu
 * @version 0.2.3
 * @copyright  © CHINESE UNION 2019
 */

const maxDistance = 321868;

router.get('/', async (req, res) => {
  let list = await database.find('regions', {}, { projection: { "_id": 0 } });
  let matrix = [];
  let markers = [];
  let counter = 0;
  for (let region of list) {
    for (let index in region.name) {
      matrix[index] = matrix[index] ? matrix[index] : [];
      matrix[index].push(region.name[index]);
    }
    markers.push({ id: counter, iconPath: `https://cuvita-1254391499.cos.na-siliconvalley.myqcloud.com/icons/region_pin.png`, width: 40, height: 40, index: counter, latitude: region.geoLocation.lat, longitude: region.geoLocation.long, zIndex: list.length - counter++ })
  };
  return res.json({ list, matrix, markers });
});

router.get('/nearest', validator.query(['lat', 'long']).exists().toFloat(), async (req, res) => {
  if (validator.validationResult(req).errors.length) return res.status(400).end();
  let { query: { lat, long } } = req;
  let regions = await database.find('regions');
  let locations = [];
  for (let region of regions)
    locations.push({ lat: region.geoLocation.lat, long: region.geoLocation.long });
  let { location, distance } = nearestLocation({ lat, long }, locations);
  if (distance > maxDistance) return res.status(404).end();
  return res.json(await database.findOne('regions', { geoLocation: { ...location } }, { projection: { "_id": 0 } }));
});

router.get('/translate/:locations', async ({ params: { locations } }, res) => {
  let { data } = await axios.get(`${ credentials.qqmap_url }/coord/v1/translate`, { params: { locations, type: 1, key: credentials.qqmap_key } });
  return res.json(data.locations);
});

module.exports = router;
