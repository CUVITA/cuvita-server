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

// router.get('/fetchDetail', async ({ query: { id } }, res) => {
//   if (!id)
//     return res.sendStatus(400)
//   return res.json(await db.findOne(COLLECTION_NAME_ARTICLE, { "_id": db.ObjectId(id) }))
// })
//
// router.get('/fetchList', async (req, res) => {
//   return res.json(await db.find(COLLECTION_NAME_ARTICLE, {}, { "title": 1, "description": 1, "thumbnail": 1}))
// })

router.use(bodyParser.json());

/**
 * Create & append article to Database
 * @type {Object}
 */
router.post('/create', async (req, res) => {
  if (req.body.salt != Credentials['text-editor'])
    return res.sendStatus(403);
  delete req.body.salt;
  return res.json((await db.insertOne(COLLECTIONS.ARTICLES, {
    ...req.body,
    // timestamp: `ISODate("${(new Date()).toISOString()}")`
    timestamp: new Date()
  })).result);
});


/**
 * Fetch article detail by reference
 * @type {Object}
 */
router.get('/detail', async ({ query: { reference } }, res) => {
  if (!reference)
    return res.sendStatus(400);
  let detail = await db.findOne(COLLECTIONS.ARTICLES, { reference }, {
    _id: 0,
    thumbnail: 0,
    rank: 0
  });
  if (!detail)
    return res.sendStatus(404);
  else
    return res.json(detail);
});

/**
 * Fetch article list
 * @type {Number}
 */
router.get('/list', async (req, res) => {
  return res.json(await db.find(COLLECTIONS.ARTICLES, {}, {
    _id: 0,
    nodes: 0,
    rank: 0
  }, {
    rank: -1
  }));
});

module.exports = router;
