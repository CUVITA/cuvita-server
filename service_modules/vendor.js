const path = require('path');
const Database = require(path.join(__dirname, '..', '..', '.common','db.js'));
const db = new Database();
const { COLLECTIONS } = require(path.join(__dirname, '..', 'config', 'db.json'));
const router = require('express').Router();

/**
 * [query description]
 * @type {Object}
 */
router.get('/categories', async ({ query: { locale, realm } }, res) => {
  if (!locale || !realm)
    return res.sendStatus(400);
  let { categories } = await db.findOne(COLLECTIONS.SCHEMAS, { realm }, {
    "_id": 0
  });
  let resultCategories = [];
  for(i = 0; i < categories.length; i++) {
    resultCategories.push({
    name: categories[i].name,
    label: categories[i].label[parseInt(locale)]});
  }
  return res.json(resultCategories);
});

/**
 * [query description]
 * @type {Object}
 */
router.get('/lists', async ({ query: { locale, realm, category, start, end} }, res) => {
  if(!realm || !category)
    return res.sendStatus(400);
  let lists = await db.find(COLLECTIONS.VENDORS,
    {
      realm,
      category
    }, {
      "_id": 0,
      "category": 0,
      "address": 0,
      "location": 0
    }, {
      "rating": -1
    });
  if (start > (lists.length - 1))
    return res.sendStatus(400);
  if (end > (lists.length))
    end = lists.length;
  for (i=0; i<lists.length; i++) {
    lists[i].name = lists[i].name[parseInt(locale)];
    lists[i].description = lists[i].description[parseInt(locale)];
  }
  lists = lists.slice(start, end);
  return res.json({ [category]: lists });
});

/**
 * [query description]
 * @type {Object}
 */
router.get('/detail', async ({query: {locale, reference}}, res) => {
  if (!reference)
    return res.sendStatus(400);
  let detail = await db.findOne(COLLECTIONS.VENDORS, { reference }, { "_id": 0 });
  if(!detail)
    return res.sendStatus(404);
  locale = parseInt(locale);
  detail.name = detail.name[locale];
  detail.description = detail.description[locale];
  detail.tag = detail.tag[locale];
  return res.json(detail);
});

module.exports = router;
