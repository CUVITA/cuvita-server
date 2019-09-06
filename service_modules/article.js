const path = require('path');
const Database = require(path.join(__dirname, '..', '..', '.common','db.js'));
const router = require('express').Router();

/**
 * CUVita Server Side Implementations - Feed Generator
 * @author relubwu
 * @version 0.2.1
 * @copyright  © CHINESE UNION 2019
 */

/**
 * Fetch article list
 * @type {Number}
 */
router.get('/lists', async (req, res) => {
  return res.json(await Database.find('articles', {}, {
    _id: 0,
    rank: 0
  }, {
    rank: -1
  }));
});

module.exports = router;
