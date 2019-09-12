const router = require('express').Router();
const database = require(`${ process.cwd() }/utils/database`);

/**
 * CUVita Server Side Implementations - User API
 * @author relubwu
 * @version 0.2.2
 * @copyright  © CHINESE UNION 2019
 */

router.get('/:openid', async ({ params: { openid } }, res) => {
  return res.json(await database.findOne('users', { openid }, { projection: { "_id": 0, "openid": 0 } }));
});

module.exports = router;
