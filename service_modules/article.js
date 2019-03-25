const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * CUVita Server Side Implementations - Feed Generator
 * @author relubwu
 * @version 0.1.5
 * @copyright  © CHINESE UNION 2019
 */

const COLLECTION_NAME_CONTENT = 'content';

router.get('/fetch', async ({ query: { id } }, res) => {
  if (!id)
    res.sendStatus(400)
  try {
    res.json(await db.findOne(COLLECTION_NAME_CONTENT, { "_id": db.ObjectId(id) }))
  } catch (e) {
    log(e.message, 2);
    res.sendStatus(500);
  }
})

module.exports = router;
