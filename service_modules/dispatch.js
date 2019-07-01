const path = require('path');
const Database = require(path.join(__dirname, '..', '..', '.common','db.js'));
const db = new Database();
const { COLLECTIONS } = require(path.join(__dirname, '..', 'config', 'db.json'));
const { APP_ID, APP_SECRET } = require(path.join(__dirname, '..', 'config', 'token.json'));
const { get, post } = require('axios');
const router = require('express').Router();
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
    let user = await db.findOne(COLLECTIONS.USERS, { openid }, { "_id": 0 });
    if (!user) {
      db.insertOne(COLLECTIONS.USERS, { openid });
    } else {
      result = { ...result, ...user };
    }
    let info = await db.findOne(COLLECTIONS.MEMBERS, { openid }, {"_id": 0, "openid": 0});
    if (!!info)
      result["member"] = info;
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
