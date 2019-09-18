const router = require('express').Router();
const database = require(`${ process.cwd() }/utils/database`);

/**
 * CUVita Server Side Implementations - Feed Generator
 * @author relubwu
 * @version 0.2.3
 * @copyright  © CHINESE UNION 2019
 */

router.get('/banner/:region', async ({ params: { region } }, res) => {
  return res.json(await database.findOne('banners', { region }, { projection: { "_id": 0, "region": 0 } }));
});

router.get('/recommendation/:region', async ({ params: { region } }, res) => {
  let { recommendations } = await database.findOne('recommendations', { region });
  let result = [];
  for (let i in recommendations) {
    let { title, action } = recommendations[i];
    result.push({ title, action, items: [] });
    for (let j in recommendations[i].items) {
      let vendor = await database.findOne('vendors', { reference: recommendations[i].items[j] }, { projection: { "_id": 0, "thumbnail": 1, "name": 1, "description": 1, "reference": 1 } });
      result[i].items.push(vendor);
    }
  }
  return res.json(result);
});

router.get('/feed/:region', async ({ params: { region } }, res) => {
  return res.json(await database.find('articles', { region }, { projection: { "_id": 0, "rank": 0, "region": 0 }, sort: { "rank": -1 }, limit: 5 }));
});

router.get('/services', async (req, res) => {
  return res.json(await database.find('services', {}, { projection: { "_id": 0 } }));
})

module.exports = router;
