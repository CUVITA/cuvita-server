const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * CUVita Server Side Implementations - Feed Generator
 * @author relubwu
 * @version 0.1.5
 * @copyright  © CHINESE UNION 2019
 */

const REALM_BANNER = 'banner';
const REALM_SEARCH = 'search';
const REALM_RECOMMENDATION = 'recommendation';

router.get('/', async(req, res) => {

})

/*
router.get('/fetchBanner', async (req, res) => {
  return res.json((await db.findOne(COLLECTION_NAME_FEED, { "realm": REALM_BANNER })).content)
})

router.get('/fetchSearch', async (req, res) => {
  return res.json((await db.findOne(COLLECTION_NAME_FEED, { "realm": REALM_SEARCH })).content)
})

router.get('/fetchRecommendation', async (req, res) => {
  return res.json((await db.findOne(COLLECTION_NAME_FEED, { "realm": REALM_RECOMMENDATION })).content)
})

router.get('/fetchArticles', async (req, res) => {
  return res.json({ "title":{"zh_CN":"为你推荐","en_US":"top stories"},"action":{"description":{"zh_CN":"查看更多","en_US":"MORE"},"url":""}, "articles":
    (await db.find(COLLECTION_NAME_ARTICLE, { "role": "article" }, { "title": 1, "description": 1, "thumbnail": 1})).slice(0, 6) })
})
*/

module.exports = router;
