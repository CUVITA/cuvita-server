const path = require('path');
const Database = require(path.join(__dirname, '..', '..', '.common','db.js'));
const { APP_ID, APP_SECRET } = require(path.join(__dirname, '..', 'config', 'token.json'));
const { get, post } = require('axios');
const router = require('express').Router();
require('log-timestamp');

/**
 * CUVita Server Side Implementations - 微信SSO凭据 Dispatcher
 * @author relubwu
 * @version 0.2.1
 * @copyright  © CHINESE UNION 2019
 */

router.get('/', async ({ query: { code } }, res) => {
  if (!code)
    return res.sendStatus(400);
  try {
    let { data: { openid, session_key } } = await get(`https://api.weixin.qq.com/sns/jscode2session?appid=${ APP_ID }&secret=${ APP_SECRET }&js_code=${ code }&grant_type=authorization_code`);
    let result = { openid, session_key };
    let user = await Database.findOne('users', { openid }, { "_id": 0 });
    if (!user) {
      Database.insertOne('users', { openid });
    } else {
      result = { ...result, ...user };
    }
    let info = await Database.findOne('members', { openid }, {"_id": 0, "openid": 0});
    if (!!info)
      result["member"] = info;
    return res.json(result);
  } catch (e) {
    console.log(e)
    return res.sendStatus(500);
  }
});

module.exports = router;
