const path = require('path');
const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * CUVita Server Side Implementations - Vendor
 * @author relubwu
 * @version 0.1.5
 * @copyright  © CHINESE UNION 2019
 */

const COLLECTION_NAME_VENDOR = 'vendor';

router.get('/fetchList', async ({ query: { realm, categories } }, res) => {
  if (!realm || !categories)
    return res.sendStatus(400);
  let list = {};
  for (let c of JSON.parse(categories)) {
    list[c] = await db.find(COLLECTION_NAME_VENDOR, {
      realm,
      "category": c
    }, {
      "_id": 0,
      "vendorid": 1,
      "displayName": 1,
      "description": 1,
      "location": 1,
      "rating": 1,
      "tag": 1,
      "thumbnail": 1
    });
  }
  return res.json(list);
});

router.get('/fetchDetail', async ({ query: { vendorid }  }, res) => {
  if (!vendorid)
    return res.sendStatus(400);
  return res.json(await db.findOne(COLLECTION_NAME_VENDOR, { vendorid }));
})

module.exports = router;
