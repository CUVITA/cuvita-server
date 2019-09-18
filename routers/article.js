const router = require('express').Router();
const database = require(`${ process.cwd() }/utils/database`);

/**
 * CUVita Server Side Implementations - Article API
 * @author relubwu
 * @version 0.2.3
 * @copyright  © CHINESE UNION 2019
 */

router.get('/lists/:region', async ({ params: { region } }, res) => {
  return res.json(await database.find('articles', { region }, { projection: { "_id": 0, "rank": 0, "region": 0 }, sort: { "rank": -1 }}));
})

module.exports = router;
