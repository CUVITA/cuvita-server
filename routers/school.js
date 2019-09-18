const router = require('express').Router();
const database = require(`${ process.cwd() }/utils/database`);

/**
 * CUVita Server Side Implementations - School API
 * @author relubwu
 * @version 0.2.3
 * @copyright  © CHINESE UNION 2019
 */

const maxDistance = 321868;

router.get('/', async (req, res) => {
  let list = await database.find('schools', {}, { projection: { "_id": 0 } });
  let matrix = [];
  let values = [];
  for (let school of list) {
    for (let index in school.name) {
      matrix[index] = matrix[index] ? matrix[index] : [];
      matrix[index].push(school.name[index]);
    }
    values.push(school.alias);
  };
  return res.json({ list, matrix, values });
});

router.get('/:alias', async ({ params: { alias } }, res) => {
  return res.json(await database.findOne('schools', { alias }, { projection: { "_id": 0 } }));
});

module.exports = router;
