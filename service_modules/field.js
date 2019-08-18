const path = require('path');
const Database = require(path.join(__dirname, '..', '..', '.common','db.js'));
const db = new Database();
const { COLLECTIONS } = require(path.join(__dirname, '..', 'config', 'db.json'));
const router = require('express').Router();

/**
 * CUVita Server Side Implementations - Feed Generator
 * @author relubwu
 * @version 0.1.6
 * @copyright  © CHINESE UNION 2019
 */

/**
 * Banner field
 * @type {[type]}
 */
router.get('/banner', async (req, res) => {
  return res.json(require(path.join(__dirname, '..', 'statics', 'banner.json')));
});

/**
 * Recommendations field
 * @type {[type]}
 */
router.get('/recommendation', async (req, res) => {
  let recommendations = require(path.join(__dirname, '..', 'statics', 'recommendations.json'));
  let payload = [];
  for (i = 0; i < recommendations.length; i++) {
    let { title, action } = recommendations[i];
    payload.push({ title, action, items: [] });
    for(j = 0; j < recommendations[i].items.length; j++) {
      let item = await db.findOne(COLLECTIONS.VENDORS,
        { reference: recommendations[i].items[j] },
        {
          _id: 0,
          thumbnail: 1,
          name: 1,
          description :1,
          reference: 1
        });
        // item["reference"] = recommendations[i].items[j];
        payload[i].items.push(item);
    }
  }
  return res.json(payload);
});

router.get('/feed', async (req, res) => {
  let { title, action } = require(path.join(__dirname, '..', 'statics', 'feed.json'));
  let payload = {
    title,
    action,
    articles: await db.find(COLLECTIONS.ARTICLES, {}, {
      _id: 0,
      nodes: 0,
      rank: 0
    }, {
      rank: -1
    }, 5)
  }
  return res.json(payload);
});

router.get('/services', async (req, res) => {
  let services = require(path.join(__dirname, '..', 'statics', 'services.json'));
  return res.json(services);
});

module.exports = router;
