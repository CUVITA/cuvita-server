const path = require('path');
const Database = require(path.join(__dirname, '..', '..', '.common','db.js'));
const db = new Database();
const { COLLECTIONS } = require(path.join(__dirname, '..', 'config', 'db.json'));
const { Credentials } = require(path.join(__dirname, '..', 'config', 'api.json'));
const router = require('express').Router();
const bodyParser = require('body-parser');

/**
 * CUVita Server Side Implementations - Feed Generator
 * @author relubwu
 * @version 0.1.7
 * @copyright  © CHINESE UNION 2019
 */

router.use(bodyParser.json());

/**
 * Fetch article list
 * @type {Number}
 */
router.get('/list', async (req, res) => {
  return res.json(await db.find(COLLECTIONS.ARTICLES, {}, {
    _id: 0,
    rank: 0
  }, {
    rank: -1
  }));
});

module.exports = router;
