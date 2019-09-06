const path = require('path');
const Database = require(path.join(__dirname, '..', '..', '.common','db.js'));
const { mapIdToRegion } = require(path.join(__dirname, '..', 'utils', 'region-converter.js'));
const router = require('express').Router();

/**
 * CUVita Server Side Implementations - Vendor API
 * @author relubwu
 * @version 0.2.1
 * @copyright  © CHINESE UNION 2019
 */

router.get('/categories', async ({ query: { realm } }, res) => {
  if (!realm)
    return res.sendStatus(400);
  let { categories } = require(path.join(__dirname, '..', 'statics', 'vendor-categories.json'))[realm];
  return res.json(categories);
});

router.get('/lists', async ({ query: { realm, region, category, limit, skip, keyword } }, res) => {
  if (!realm || !category || !region)
    return res.sendStatus(400);
  let criteria;
  if (keyword.length == 0) {
    criteria = {
      realm,
      category,
      location: { $geoWithin: {  } }
    }
  } else {
    criteria = {
      realm,
      category,
      location: { $geoWithin: {  } },
      name: !!keyword ? new RegExp(keyword, 'ig') : ''
    }
  }
  let { geoLocation: { lat, long } } = mapIdToRegion(region);
  criteria.location.$geoWithin.$centerSphere = [ [ long, lat ], 0.01 ];
  let lists = await Database.find('vendors',
    criteria, {
      _id: 0,
      category: 0,
      address: 0,
      location: 0
    }, {
      rating: -1
    }, parseInt(limit), parseInt(skip));
  return res.json({ [category]: lists });
});

router.get('/detail', async ({ query: { reference } }, res) => {
  if (!reference)
    return res.sendStatus(400);
  let detail = await Database.findOne('vendors', { reference }, { "_id": 0 });
  if (!detail)
    return res.sendStatus(404);
  return res.json(detail);
});

module.exports = router;
