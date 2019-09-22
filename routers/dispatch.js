const router = require('express').Router();
const credentials = require(`${ process.cwd() }/config/credentials.json`);
const database = require(`${ process.cwd() }/utils/database`);

/**
 * CUVita Server Side Implementations - WeChat SSO
 * @author relubwu
 * @version 0.2.5
 * @copyright  © CHINESE UNION 2019
 */

router.get('/:code', async ({ params: { code } }, res) => {
  let { data: { openid, session_key, errcode } } = await require('axios').get(`https://api.weixin.qq.com/sns/jscode2session?appid=${ credentials.appid }&secret=${ credentials.appsecret }&js_code=${ code }&grant_type=authorization_code`);
  if (errcode === 40029) return res.status(400).end();
  let result = { openid, session_key };
  let user = (await database.findOneAndUpdate('users', { openid }, { $set: { openid } }, { projection: { "_id": 0 }, upsert: true, returnNewDocument: true })).value;
  let member = await database.findOne('members', { openid }, { projection: { "_id": 0, "openid": 0 } });
  return member ? res.json({ user, member }) : res.json({ user });
});

module.exports = router;
