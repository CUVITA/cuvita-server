const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * CUVita Server Side Implementations - Feed Generator
 * @author relubwu
 * @version 0.1.5
 * @copyright  © CHINESE UNION 2019
 */

router.get('/fetch', async (req, res) => {
  let banner = await db.findOne('feed', { "realm": "banner" });
  let search = await db.findOne('feed', { "realm": "search" });
  let recommendation = await db.findOne('feed', { "realm": "recommendation" });
  let result = {
    banner: banner.content,
    search: search.content,
    recommendation: recommendation.content,
    feed: {
      title: {},
      action: {
        description: {},
        url: ""
      },
      items: await db.find('content', {}, {
        "title": 1,
        "description": 1,
        "thumbnail": 1
      })
    }
  }
  res.json(result);
});

module.exports = router;
