const path = require('path');
const Database = require(path.join(__dirname, '..', '..', '.common','db.js'));
const db = new Database();
const { COLLECTIONS } = require(path.join(__dirname, '..', 'config', 'db.json'));
const { getPrepayID } = require(path.join(__dirname, '..', 'config', 'api.json'));
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

router.get('/register', async ({ query: { name, gender, tel, birthday, openid } }, res) => {
  if (!name || !gender || !tel || !birthday || !openid)
    return res.sendStatus(400);
  let { data } = await get(`${getPrepayID}${openid}`);
  let prepayID = data.package.substring(10);
  await db.updateOne(COLLECTIONS.REGISTRATIONS, { openid }, {
    $set: {
      openid,
      data: {
        name,
        gender: parseInt(gender),
        tel,
        birthday
      },
      status: 'PENDING',
      prepayID
    }
  }, true);
  // let exists = false;
  // if (!! await db.find(COLLECTIONS.MEMBERS, { name, gender, tel, birthday }))
  //   exists = true;
  // res.json({ bundle: data, exists });
  res.json(data);
})

module.exports = router;
