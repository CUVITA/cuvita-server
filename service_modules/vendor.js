const path = require('path');
const express = require('express');
const router = express.Router();
const db = require(path.join(__dirname, '..', 'db.js'));

/**
 * return an array of schemas in specific language
 */
router.get('/categories', async ({ query: { locale, realm } }, res) => {
  if (!locale || !realm)
    return res.sendStatus(400);

  let { categories } = await db.findOne(db.COLLECTIONS.SCHEMAS, { realm }, {
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
 * return an array of lists of request categories
 */
router.get('/lists', async ({ query: { locale, realm, category, start, end} }, res) => {
  if(!realm || !category)
    return res.sendStatus(400);


  let lists = await db.find(db.COLLECTIONS.VENDORS,
    {realm: realm, category: category},
    {
      "_id": 0,
      "category": 0,
      "address": 0,
      "location": 0
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

router.get('/detail', async ({query: {locale, reference}}, res) => {
  if (!reference)
    return res.sendStatus(400);

  let detail = await db.findOne(db.COLLECTIONS.VENDORS, {reference: reference},
  {"_id":0});

  if(!detail)
    return res.sendStatus(404);

  detail.name = detail.name[parseInt(locale)];
  detail.description = detail.description[parseInt(locale)];
  detail.tag = detail.tag[parseInt(locale)];

  return res.json(detail);
});

module.exports = router;
