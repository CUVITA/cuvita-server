const router = require('express').Router();
const database = require(`${ process.cwd() }/utils/database`);
const validator = require('express-validator');

/**
 * CUVita Server Side Implementations - Vendor API
 * @author relubwu
 * @version 0.2.2
 * @copyright  © CHINESE UNION 2019
 */

// $centerSphere
const geoWithinRadius = 0.01;

router.get('/categories/:realm', async ({ params: { realm } }, res) => {
  return res.json(require(`${ process.cwd() }/statics/vendor-categories.json`)[realm]);
});

router.get('/lists/:realm/:category/:region', [ validator.query('skip').exists().toInt(), validator.query('keyword').trim() ],async (req, res) => {
  if (validator.validationResult(req).errors.length) return res.status(400).end();
  let { params: { realm, category, region }, query: { skip, keyword } } = req;
  let { geoLocation: { lat, long } } = await database.findOne('regions', { alias: region });
  return res.json(await database.find('vendors', { realm, category, location: { $geoWithin: { $centerSphere: [ [ long, lat ], geoWithinRadius ] } }, name: keyword ? new RegExp(keyword, 'ig') : new RegExp('.') }, { projection: { "_id": 0, "category": 0, "address": 0, "location": 0, "realm": 0 }, sort: { "rating": -1 }, limit: 10, skip }));
});

router.get('/detail/:reference', async({ params: { reference } }, res) => {
  let vendor = await database.findOne('vendors', { reference }, { projection: { "_id": 0 } });
  return vendor ? res.json(vendor) : res.status(404).end();
});

module.exports = router;
