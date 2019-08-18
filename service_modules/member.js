const path = require('path');
const Database = require(path.join(__dirname, '..', '..', '.common','db.js'));
const db = new Database();
const { COLLECTIONS } = require(path.join(__dirname, '..', 'config', 'db.json'));
const { ROOT, API: { getBundle } } = require(path.join(__dirname, '..', 'config', 'api.json'));
const { get } = require('axios');
const router = require('express').Router();

router.use(require('body-parser').json());

router.get('/getInfo', async({ query: { openid } }, res) => {
  if (!openid)
    return res.sendStatus(400);

  let info = await db.findOne(COLLECTIONS.MEMBERS, {openid: openid}, {"_id": 0, "openid": 0});
  if (!info)
    return res.sendStatus(404);
  return res.json(info);
});

router.get('/link', async({ query: { cardID, name, openid } }, res) => {
  if (!cardID || !name || !openid)
    return res.sendStatus(400);
  let result = await db.findOne(COLLECTIONS.MEMBERS, { name, cardID }, {"_id": 0, "_openid": 0});
  if(!result) {
    return res.sendStatus(404);
  } else {
    await db.updateOne(COLLECTIONS.MEMBERS, { cardID },
      {
        $set:
          {
            openid
          }
      });
    return res.json(result);
  }
});

router.post('/register', async ({ body: { name, gender, tel, birthday, openid, email, region } }, res) => {
  if (!name || gender === null || !tel || !birthday || !openid || !email || region === null)
    return res.sendStatus(400);
  let { data: { bundle, outTradeNo } } = await get(`${ ROOT }${ getBundle }?item=membership&openid=${ openid }`);
  await db.insertOne(COLLECTIONS.TRANSACTIONS, {
    data: {
      openid,
      name,
      gender: parseInt(gender),
      tel,
      birthday: new Date(birthday),
      email,
      region: parseInt(region)
    },
    status: 'PENDING',
    notify: `${ ROOT }/member/register`,
    outTradeNo
  });
  return res.json(bundle);
});

router.get('/register', async ({ query: { outTradeNo } }, res) => {
  if (!outTradeNo)
    return res.sendStatus(400);
  let { data, transactionID } = await db.findOne(COLLECTIONS.TRANSACTIONS, { outTradeNo });
  data.birthday = new Date(data.birthday);
  await db.insertOne(COLLECTIONS.MEMBERS, {
    ...data,
    cardID: transactionID.substring(transactionID.length - 8, transactionID.length),
    regdate: new Date(),
    credit: {
      cumulative: 0,
      tier: 0,
      redeem: 0
    },
    history: [],
    coupon: []
  });
  return res.end();
});

router.post('/modify', async({ body: { name, gender, tel, birthday, openid, email, region } }, res) => {
  if (!name || gender === null || !tel || !birthday || !openid || !email || region === null)
    return res.sendStatus(400);
  return res.json((await db.updateOne(COLLECTIONS.MEMBERS, { openid }, {
    $set: {
      name,
      gender: parseInt(gender),
      tel,
      birthday: new Date(birthday),
      email,
      region
    }
  }, true)).result);
})

module.exports = router;
