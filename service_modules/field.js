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
})

// router.get('/', async({ query: { locale } }, res) => {
//   if (!locale)
//     return res.sendStatus(400);
//   locale = parseInt(locale);
//   let banners = await db.find("banners", { locale }, {
//     "_id": 0,
//     "locale": 0
//   });
//   let recommendationsList = await db.find(COLLECTIONS.RECOMMENDATIONS, {}, { "_id": 0 });
//   for (i = 0; i < recommendationsList.length; i++) {
//     recommendationsList[i].title = recommendationsList[i].title[locale];
//     recommendationsList[i].action = recommendationsList[i].action[locale];
//     for(j = 0; j < recommendationsList[i].items.length; j++) {
//       let itemObject = await db.findOne(COLLECTIONS.VENDORS,
//         { "reference": recommendationsList[i].items[j] },
//         {
//           "_id": 0,
//           "thumbnail": 1,
//           "name": 1,
//           "description" :1
//         });
//         itemObject.name = itemObject.name[locale];
//         itemObject.description = itemObject.description[locale];
//         itemObject["reference"] = recommendationsList[i].items[j];
//         recommendationsList[i].items[j] = itemObject;
//     }
//   }
//   let articleList = await db.find(COLLECTIONS.ARTICLES, {},
//     {"_id": 0, "thumbnail":1, "title": 1, "description":1, "reference":1}, {"precedence": -1});
//   if(articleList.length > 5) {
//     articleList = articleList.slice(0, 5);
//   }
//   return res.json({
//     banner: banners[Math.floor(Math.random() * banners.length)],
//     recommendations: [recommendationsList[Math.floor(Math.random() * recommendationsList.length)]],
//     article: articleList
//   });
// });

module.exports = router;
