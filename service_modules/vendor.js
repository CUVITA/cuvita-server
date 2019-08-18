const path = require('path');
const Database = require(path.join(__dirname, '..', '..', '.common','db.js'));
const db = new Database();
const { COLLECTIONS } = require(path.join(__dirname, '..', 'config', 'db.json'));
const router = require('express').Router();

/**
 * Acquire vendor categories by realm
 * @type {Object}
 */
router.get('/categories', async ({ query: { realm } }, res) => {
  if (!realm)
    return res.sendStatus(400);
  let { categories } = require(path.join(__dirname, '..', 'statics', 'vendor-categories.json'))[realm];
  return res.json(categories);
});

/**
 * [query description]
 * @type {Object}
 */
router.get('/lists', async ({ query: { realm, category, limit, skip, keyword } }, res) => {
  if (!realm || !category)
    return res.sendStatus(400);
  let criteria;
  if (keyword.length == 0) {
    criteria = {
      realm,
      category
    }
  } else {
    criteria = {
      realm,
      category,
      name: !!keyword ? new RegExp(keyword, 'ig') : ''
    }
  }
  let lists = await db.find(COLLECTIONS.VENDORS,
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

/**
 * [query description]
 * @type {Object}
 */
router.get('/detail', async ({ query: { reference } }, res) => {
  if (!reference)
    return res.sendStatus(400);
  let detail = await db.findOne(COLLECTIONS.VENDORS, { reference }, { "_id": 0 });
  if (!detail)
    return res.sendStatus(404);
  return res.json(detail);
});

module.exports = router;
