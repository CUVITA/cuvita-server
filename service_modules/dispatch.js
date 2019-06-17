
const path = require('path');
const db = require(path.join(__dirname, '..', 'db.js'));
const router = require('express').Router();
const { APP_ID, APP_SECRET } = require(path.join(__dirname, '..', 'config', 'token.json'));
const { get } = require('axios');

require('log-timestamp');

/**
 * CUVita Server Side Implementations - 换取微信SSO凭据
 * @version 0.1.6
 */

/**
 * [query description]
 * @type {Object}
 */
router.get('/', async ({ query: { code } }, res) => {
  if (!code)
    return res.sendStatus(400);
  try {
    let { data: { openid, session_key } } = await get(`https://api.weixin.qq.com/sns/jscode2session?appid=${ APP_ID }&secret=${ APP_SECRET }&js_code=${ code }&grant_type=authorization_code`);
    let result = { openid, session_key };
    let user = await db.findOne(db.COLLECTIONS.USERS, {openid});
    if (!user) {
      db.insertOne(db.COLLECTIONS.USERS, { openid, data: "" });
    } else {
      result = { ...result, ...user };
    }
    return res.json(result);
  } catch (e) {
    console.log(e)
    return res.sendStatus(500);
  }
});

/**
 * [exports description]
 * @type {[type]}
 */
module.exports = router;
