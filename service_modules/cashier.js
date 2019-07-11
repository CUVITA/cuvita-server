const path = require('path');
const Database = require(path.join(__dirname, '..', '..', '.common','db.js'));
const db = new Database();
const { COLLECTIONS } = require(path.join(__dirname, '..', 'config', 'db.json'));
const { APP_ID } = require(path.join(__dirname, '..', 'config', 'token.json'));
const tenpay = require('tenpay');
const config = require(path.join(__dirname, '..', 'config', 'tenpay.json'));
const { body, total_fee } = require(path.join(__dirname, '..', 'config', 'merchandise.json'));
const api = tenpay.init({ appid: APP_ID , ...config });
const router = require('express').Router();
const bodyParser = require('body-parser');

const sessions = {};

router.use(bodyParser.text({type: '*/xml'}));

router.get('/getPrepayID', async ({ query: { openid }, ip }, res) => {
  if (!openid)
    return res.sendStatus(400);
  let out_trade_no = Math.floor(Date.now() / 1000) + openid.substring(openid.length - 4, openid.length);
  sessions[out_trade_no] = {};
  sessions[out_trade_no] = await api.getPayParams({
    out_trade_no,
    body,
    total_fee,
    openid
  });
  res.json(sessions[out_trade_no]);
});

// 支付结果通知/退款结果通知
router.post('/dock', api.middlewareForExpress('pay'), async (req, res) => {
  let { result_code, transaction_id, openid } = req.weixin;
  if (result_code == 'SUCCESS') {
    await db.updateOne(COLLECTIONS.REGISTRATIONS, { openid }, {
      $set: {
        status: 'SUCCESS',
        transaction_id
      }
    });
    let { data } = await db.findOne(COLLECTIONS.REGISTRATIONS, { openid });
    await db.insertOne(COLLECTIONS.MEMBERS, {
      ...data,
      openid,
      cardID: transaction_id.substring(transaction_id.length - 8, transaction_id.length),
      regdate: Date.now(),
      credit: {
        cumulative: 0,
        tier: 0,
        redeem: 0
      },
      history: [],
      coupon: [],
      cardColor: 0
    });
  } else {
    await db.updateOne(COLLECTIONS.REGISTRATIONS, { openid }, {
      $set: {
        status: 'FAIL',
        transaction_id
      }
    });
  }
  // 回复消息(参数为空回复成功, 传值则为错误消息)
  res.reply('');
});

module.exports = router;
