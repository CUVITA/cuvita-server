const path = require('path');
const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * CUVita Server Side Implementations - Member
 * @author relubwu
 * @version 0.1.5
 * @copyright  © CHINESE UNION 2019
 */

const COLLECTION_NAME_MEMBER = 'member';

router.get('/fetchInfo', async({ query: { openid } }, res) => {
  if (!openid)
    return res.sendStatus(400);
  let result = await db.findOne(COLLECTION_NAME_MEMBER, { openid }, { "_id": 0, "openid": 0 })
  return !!result ? res.json(result) : res.sendStatus(404);
})

module.exports = router;
