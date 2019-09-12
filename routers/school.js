const router = require('express').Router();
const database = require(`${ process.cwd() }/utils/database`);

/**
 * CUVita Server Side Implementations - School API
 * @author relubwu
 * @version 0.2.2
 * @copyright  © CHINESE UNION 2019
 */

const maxDistance = 321868;

router.get('/', async (req, res) => {
  return res.json(await database.find('schools', {}, { projection: { "_id": 0 } }));
});

router.get('/:alias', async ({ params: { alias } }, res) => {
  return res.json(await database.findOne('schools', { alias }, { projection: { "_id": 0 } }));
});

module.exports = router;
