const path = require('path');
const Database = require(path.join(__dirname, '..', '..', '.common','db.js'));
const db = new Database();
const { COLLECTIONS } = require(path.join(__dirname, '..', 'config', 'db.json'));
const merchandises = require(path.join(__dirname, '..', 'config', 'merchandises.json'));
const api = require('tenpay').init({ appid: require(path.join(__dirname, '..', 'config', 'token.json')).APP_ID , ...require(path.join(__dirname, '..', 'config', 'tenpay.json')) });
const router = require('express').Router();
const { get } = require('axios');
const bodyParser = require('body-parser');

// router.use(bodyParser.text({type: '*/xml'}));

router.get('/bundle', async ({ query: { openid, item } }, res) => {
  if (!openid)
    return res.sendStatus(400);
  if (!merchandises[item])
    return res.sendStatus(404);
  // Static typecast
  let out_trade_no = `${ Math.floor(Date.now() / 1000) }${openid.substring(openid.length - 6, openid.length)}`;
  let bundle;
  try {
    bundle = await api.getPayParams({
      out_trade_no,
      ...merchandises[item],
      openid
    });
  } catch (e) {
    return res.sendStatus(400);
  }
  return res.json({
    bundle,
    outTradeNo: out_trade_no
  });
});

// 支付结果通知/退款结果通知
router.post('/dock', api.middlewareForExpress('pay'), async (req, res) => {
  let { result_code, transaction_id, out_trade_no } = req.weixin;
  await db.updateOne(COLLECTIONS.TRANSACTIONS, { outTradeNo: out_trade_no }, {
      $set: {
        status: result_code,
        transactionID: transaction_id
      }
  }, true);
  if (result_code === 'SUCCESS') {
    let { notify } = await db.findOne(COLLECTIONS.TRANSACTIONS, { outTradeNo: out_trade_no });
    await get(`${ notify }?outTradeNo=${ out_trade_no }`);
  }
  return res.reply('');
});

module.exports = router;
