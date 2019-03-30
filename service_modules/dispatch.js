const path = require('path');
const express = require('express');
const router = express.Router();
const { get } = require('axios');
const db = require('../db');

/**
 * CUVita Server Side Implementations - Dispatcher
 * @author relubwu
 * @version 0.1.5
 * @copyright  © CHINESE UNION 2019
 */

const {
  APP_ID,
  APP_SECRET
} = require(path.join(__dirname, 'config', 'dispatchconfig.json'));

router.get('/', async ({ query: { code } }, res) => {
  if (!code)
    res.sendStatus(400);
  let { data: { openid, session_key } } = await get(`https://api.weixin.qq.com/sns/jscode2session?appid=${ APP_ID }&secret=${ APP_SECRET }&js_code=${ code }&grant_type=authorization_code`);
  res.json({ openid, session_key });
});

module.exports = router;
