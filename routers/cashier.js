const router = require('express').Router();
const database = require(`${ process.cwd() }/utils/database`);
const validator = require('express-validator');
const axios = require('axios');
const credentials = require(`${ process.cwd() }/config/credentials`);
const tenpay = require('tenpay').init({ ...credentials });

/**
 * CUVita Server Side Implementations - Platform Cashier
 * @author relubwu
 * @version 0.2.2
 * @copyright  © CHINESE UNION 2019
 */

router.use(require('body-parser').text({type: '*/xml'}));

router.get('/:name/bundle', validator.query('openid').exists(), async (req, res) => {
  if (validator.validationResult(req).errors.length) return res.status(400).end();
  let { query: { openid }, params: { name } } = req;
  let merchandise = await database.findOne('merchandises', { name }, { projection: { "_id": 0, "body": 1, "total_fee": 1 } });
  if (!merchandise) return res.status(404).end();
  let out_trade_no = `${ Math.floor(Date.now() / 1000) }${openid.substring(openid.length - 6, openid.length)}`;
  let bundle = await tenpay.getPayParams({ out_trade_no, ...merchandise, openid });
  return res.json({ bundle: await tenpay.getPayParams({ out_trade_no, ...merchandise, openid }), out_trade_no });
});

router.post('/dock', tenpay.middlewareForExpress('pay'), async (req, res) => {
  let { weixin: { result_code, transaction_id, out_trade_no } } = req;
  let { value: { notify } } = await database.findOneAndUpdate('transactions', { out_trade_no }, { $set: { status: result_code, transaction_id } }, { projection: { "_id": 0 } });
  if (notify) {
    await axios.get(`${ notify }/${ out_trade_no }`);
    return res.reply('');
  } else {
    return res.reply('Corresponding transaction not found');
  }
});

module.exports = router;
