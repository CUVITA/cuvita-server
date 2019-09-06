const path = require('path');
const Database = require(path.join(__dirname, '..', '..', '.common','db.js'));
const router = require('express').Router();

/**
 * CUVita Server Side Implementations - Feed Generator
 * @author relubwu
 * @version 0.2.1
 * @copyright  © CHINESE UNION 2019
 */

router.get('/banner', async ({ query: { region } }, res) => {
  if (!region)
    return res.sendStatus(400);
  return res.json(require(path.join(__dirname, '..', 'statics', 'banner.json'))[region]);
});

router.get('/recommendation', async ({ query: { region } }, res) => {
  if (!region)
    return res.sendStatus(400);
  let recommendations = require(path.join(__dirname, '..', 'statics', 'recommendations.json'))[region];
  let payload = [];
  for (i = 0; i < recommendations.length; i++) {
    let { title, action } = recommendations[i];
    payload.push({ title, action, items: [] });
    for(j = 0; j < recommendations[i].items.length; j++) {
      let item = await Database.findOne('vendors',
        { reference: recommendations[i].items[j] },
        {
          _id: 0,
          thumbnail: 1,
          name: 1,
          description :1,
          reference: 1
        });
        payload[i].items.push(item);
    }
  }
  return res.json(payload);
});

router.get('/feed', async ({ query: { region } }, res) => {
  if (!region)
    return res.sendStatus(400);
  let { title, action, articles } = require(path.join(__dirname, '..', 'statics', 'feed.json'))[region];
  let payload = {
    title,
    action,
    articles: await Database.find('articles', {
      reference: {
        $in: articles
      }
    }, {
      _id: 0,
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
