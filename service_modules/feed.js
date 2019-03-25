const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * CUVita Server Side Implementations - Feed Generator
 * @author relubwu
 * @version 0.1.5
 * @copyright  © CHINESE UNION 2019
 */

const COLLECTION_NAME_FEED = 'feed';
const COLLECTION_NAME_CONTENT = 'content';
const REALM_BANNER = 'banner';
const REALM_SEARCH = 'search';
const REALM_RECOMMENDATION = 'recommendation';

router.get('/fetchBanner', async (req, res) => {
  try {
    res.json((await db.findOne(COLLECTION_NAME_FEED, { "realm": REALM_BANNER })).content)
  } catch (e) {
    res.sendStatus(400);
    console.error(e);
  }
})

router.get('/fetchSearch', async (req, res) => {
  try {
    res.json((await db.findOne(COLLECTION_NAME_FEED, { "realm": REALM_SEARCH })).content)
  } catch (e) {
    res.sendStatus(400);
    console.error(e);
  }
})

router.get('/fetchRecommendation', async (req, res) => {
  try {
    res.json((await db.findOne(COLLECTION_NAME_FEED, { "realm": REALM_RECOMMENDATION })).content)
  } catch (e) {
    res.sendStatus(400);
    console.error(e);
  }
})

router.get('/fetchArticles', async (req, res) => {
  try {
    res.json({ "title":{"zh_CN":"为你推荐","en_US":"top stories"},"action":{"description":{"zh_CN":"查看更多","en_US":"MORE"},"url":""}, "articles":
    (await db.find(COLLECTION_NAME_CONTENT, { "role": "article" }, { "title": 1, "description": 1, "thumbnail": 1})).slice(0, 6) })
  } catch (e) {
    res.sendStatus(400);
    console.error(e);
  }
})

module.exports = router;
