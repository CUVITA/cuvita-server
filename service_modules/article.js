const path = require('path');
const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * CUVita Server Side Implementations - Feed Generator
 * @author relubwu
 * @version 0.1.5
 * @copyright  © CHINESE UNION 2019
 */

//const COLLECTION_NAME_CONTENT = 'content';
const COLLECTION_NAME_ARTICLE = 'article';

router.get('/fetchDetail', async ({ query: { id } }, res) => {
  if (!id)
    res.sendStatus(400)
  try {
    res.json(await db.findOne(COLLECTION_NAME_ARTICLE, { "_id": db.ObjectId(id) }))
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
})

router.get('/fetchList', async (req, res) => {
  try {
    res.json(await db.find(COLLECTION_NAME_ARTICLE, {}, { "title": 1, "description": 1, "thumbnail": 1}))
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
})

router.get('/editor', async (req, res) =>
  res.sendFile(path.join(__dirname, '..', 'web', 'article-editor.html'))
)

module.exports = router;
