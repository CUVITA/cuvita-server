const path = require('path');
const Database = require(path.join(__dirname, '..', '..', '.common','db.js'));
const Merchandises = require(path.join(__dirname, '..', 'config', 'merchandises.json'));
const api = require('tenpay').init({ appid: require(path.join(__dirname, '..', 'config', 'token.json')).APP_ID , ...require(path.join(__dirname, '..', 'config', 'tenpay.json')) });
const router = require('express').Router();
const { get } = require('axios');

/**
 * CUVita Server Side Implementations - Platform Cashier
 * @author relubwu
 * @version 0.2.1
 * @copyright  © CHINESE UNION 2019
 */

router.use(require('body-parser').text({type: '*/xml'}));

router.get('/bundle', async ({ query: { openid, item } }, res) => {
  if (!openid)
    return res.sendStatus(400);
  if (!Merchandises[item])
    return res.sendStatus(404);
  // Static typecast
  let out_trade_no = `${ Math.floor(Date.now() / 1000) }${openid.substring(openid.length - 6, openid.length)}`;
  let bundle;
  try {
    bundle = await api.getPayParams({
      out_trade_no,
      ...Merchandises[item],
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
  await Database.updateOne('transactions', { outTradeNo: out_trade_no }, {
      $set: {
        status: result_code,
        transactionID: transaction_id
      }
  }, true);
  if (result_code === 'SUCCESS') {
    let { notify } = await Database.findOne('transactions', { outTradeNo: out_trade_no });
    await get(`${ notify }?outTradeNo=${ out_trade_no }`);
  }
  return res.reply('');
});

module.exports = router;
