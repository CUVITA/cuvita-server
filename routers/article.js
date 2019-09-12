const router = require('express').Router();
const database = require(`${ process.cwd() }/utils/database`);

router.get('/lists/:region', async ({ params: { region } }, res) => {
  return res.json(await database.find('articles', { alias: region }, { projection: { "_id": 0, "rank": 0, "region": 0 }, sort: { "rank": -1 }}));
})

module.exports = router;
