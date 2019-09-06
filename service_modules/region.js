const path = require('path');
const Regions = require(path.join(__dirname, '..', 'config', 'region.json'));
const nearestLocation = require('map-nearest-location');
const router = require('express').Router();
const { mapIndexToRegion } = require(path.join(__dirname, '..', 'utils', 'region-converter'));

/**
 * CUVita Server Side Implementations - Region API
 * @author relubwu
 * @version 0.1.7
 * @copyright  © CHINESE UNION 2019
 */

const MAX_NEAREST_DISTANCE = 321868;

router.get('/nearest', async ({ query: { lat, long } }, res) => {
  if (!lat || !long)
    return res.sendStatus(400);
  let lng = parseFloat(long);
  lat = parseFloat(lat);
  let locations = [];
  for (let region of Regions)
    if (!!region.geoLocation)
      locations.push({
        lat: region.geoLocation.lat,
        lng: region.geoLocation.long
      });
  let { closestIndex, distance } = nearestLocation({
    lat, lng
  }, locations);
  if (distance > MAX_NEAREST_DISTANCE)
    return res.sendStatus(404);
  return res.json({
    id: mapIndexToRegion(closestIndex).id,
    distance
  });
});

module.exports = router;
