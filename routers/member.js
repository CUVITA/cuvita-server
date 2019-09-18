const router = require('express').Router();
const database = require(`${ process.cwd() }/utils/database`);
const localhost = require(`${ process.cwd() }/utils/localhost`);
const validator = require('express-validator');
const axios = require('axios');

/**
 * CUVita Server Side Implementations - Member API
 * @author relubwu
 * @version 0.2.3
 * @copyright  © CHINESE UNION 2019
 */

router.use(require('body-parser').json());

router.get('/:openid', async({ params: { openid } }, res) => {
  let member = await database.findOne('members', { openid }, { projection: { "_id": 0, "openid": 0 } });
  return member ? res.json(member) : res.status(404).end();
});

router.post('/link', validator.body(['openid', 'cardid', 'name']).exists(), async(req, res) => {
  if (validator.validationResult(req).errors.length) return res.status(400).end();
  let { body: { openid, cardid, name } } = req;
  let member = await database.findOne('members', { name, cardid }, { projection: { "_id": 0, "openid": 0 } });
  if (!member) return res.status(404).end();
  await database.updateOne('members', { cardid }, { $set: { openid } });
  return res.status(200).end();
});

router.post('/register', [ validator.body(['openid', 'name', 'gender', 'tel', 'birthday', 'email', 'school']).exists(), validator.body('name').trim(), validator.body('gender').toInt(), validator.body('birthday').toDate() ], async(req, res) => {
  if (validator.validationResult(req).errors.length) return res.status(400).end();
  let { body } = req;
  let { data: { bundle, out_trade_no } } = await localhost.get(`/cashier/membership/bundle`, { params: { openid: body.openid } });
  await database.insertOne('transactions', { data: { ...body }, status: 'PENDING', notify: `http://localhost:${ localhost.port }/member/register`, out_trade_no});
  return res.json(bundle);
});

router.get('/register/:out_trade_no', async (req, res) => {
  let { params: { out_trade_no } } = req;
  let { data } = await database.findOne('transactions', { out_trade_no });
  await database.insertOne('members', { ...data, regdate: new Date(), credit: { cumulative: 0, tier: 0 }, history: [], coupon: [], redeemable: [] });
  return res.end();
});

router.post('/modify', [ validator.body(['openid', 'name', 'gender', 'tel', 'birthday', 'email', 'school']).exists(), validator.body('gender').toInt(), validator.body('birthday').toDate() ], async(req, res) => {
  if (validator.validationResult(req).errors.length) return res.status(400).end();
  let { body } = req;
  await database.updateOne('members', { openid: body.openid }, { $set: { ...body } });
  return res.status(200).end();
});

module.exports = router;
