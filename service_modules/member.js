const path = require('path');
const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * CUVita Server Side Implementations - Member
 * @author relubwu
 * @version 0.1.5
 * @copyright  © CHINESE UNION 2019
 */

const COLLECTION_NAME_MEMBER = 'member';
const COLLECTION_NAME_ENV = 'env';
const {
  CREDIT_POLICY
} = require(path.join(__dirname, 'config', 'memberconfig.json'));

const REGISTER_CACHE = {};

router.use(require('body-parser').json());

router.get('/fetchInfo', async ({ query: { openid } }, res) => {
  if (!openid)
    return res.sendStatus(400);
  let result = await db.findOne(COLLECTION_NAME_MEMBER, { openid }, { "_id": 0, "cardno": 1, "name": 1, "credit": 1 });
  if (!result)
    return res.sendStatus(404);
  result.credit = { ...result.credit, ...CREDIT_POLICY };
  return res.json(result);
});

router.get('/fetchCredit', async ({ query: { openid } }, res) => {
  if (!openid)
    return res.sendStatus(400);
  let result = await db.findOne(COLLECTION_NAME_MEMBER, { openid }, { "_id": 0, "credit": 1 });
  if (!result)
    return res.sendStatus(404);
  let { credit } = result;
  credit = { ...credit, ...CREDIT_POLICY };
  return res.json(credit);
})

router.get('/fetchHistory', async ({ query: { openid } }, res) => {
  if (!openid)
    return res.sendStatus(400);
  let result = await db.findOne(COLLECTION_NAME_MEMBER, { openid }, { "_id": 0, "history": 1 });
  if (!result)
    return res.sendStatus(404);
  let { history } = result;
  if (history.length == 0)
    return res.json([]);
  for (let e of history.keys()) {
    let { vendorid } = history[e];
    let { displayName, realm } = await db.findOne('vendor', {
      vendorid
    }, {
      "_id": 0,
      "displayName": 1,
      "thumbnail": 1,
      "realm": 1
    });
    history[e] = { ...history[e], displayName, realm }
  }
  return res.json(await history);
});

router.get('/fetchCoupon', async ({ query: { openid } }, res) => {
  if (!openid)
    return res.sendStatus(400);
  let result = await db.findOne(COLLECTION_NAME_MEMBER, { openid }, { "_id": 0, "coupon": 1 });
  if (!result)
    return res.sendStatus(404);
  let { coupon } = result;
  if (coupon.length == 0)
    return res.json([]);
  for (let e of coupon.keys()) {
    let { vendorid } = coupon[e];
    let { displayName, realm, thumbnail } = await db.findOne('vendor', {
      vendorid
    }, {
      "_id": 0,
      "displayName": 1,
      "thumbnail": 1,
      "realm": 1
    });
    coupon[e] = { ...coupon[e], displayName, realm, thumbnail }
  }
  return res.json(await coupon);
});

router.post('/bind', async({ body: { cardno, name, openid } }, res) => {
  if (!cardno || !name || !openid)
    return res.sendStatus(400);
  let memberInfo = await db.findOne(COLLECTION_NAME_MEMBER, { cardno, name }, { "_id": 0, "cardno": 1, "name": 1, "credit": 1 });
  if (!memberInfo)
    return res.sendStatus(404);
  await db.updateOne(COLLECTION_NAME_MEMBER, { cardno, name }, {
    $set: {
      'openid': openid
    }
  });
  memberInfo.credit = { ...memberInfo.credit, ...CREDIT_POLICY };
  return res.json(memberInfo);
});

router.post('/register', async({ body }, res) => {
  let { openid, procedure } = body;
  if (!openid || !procedure)
    return res.sendStatus(400);
  switch (procedure) {
    case 'handshake':
      let { payload } = body
      REGISTER_CACHE[openid] = { ...payload };
      return res.json({
        ...(await db.findOne(COLLECTION_NAME_ENV, {
          "role": "scheme",
          "realm": "memberRegistration"
        }, {
          "_id": 0,
          "entries": 1
        })).entries,
        package: `prepay_id=`
      });
      break;
    case 'prepay':
      break;
    case 'postpaid':
      break
    default:
      return res.sendStatus(400);
      break;
  }
})

module.exports = router;
