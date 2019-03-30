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

const COLLECTION_NAME_ENV = 'env';
const COLLECTION_NAME_MEMBER = 'member';
const COLLECTION_NAME_VENDOR = 'vendor';
const {
  AUTH_HEADER
} = require(path.join(__dirname, 'config', 'actionconfig.json'));
const {
  CREDIT_POLICY
} = require(path.join(__dirname, 'config', 'memberconfig.json'));

router.use(async (req, res, next) => {
  let credentials = {
    ...(await db.findOne(COLLECTION_NAME_ENV, {
      "role": "credentials",
      "realm": "associate"
    })).entries,
    ...(await db.findOne(COLLECTION_NAME_ENV, {
      "role": "credentials",
      "realm": "vendor"
    })).entries
  }
  let user = require('basic-auth')(req);
  if (!user || !credentials[user.name] || credentials[user.name] !== user.pass) {
    res.header('WWW-Authenticate', 'Basic realm="action"')
    return res.sendStatus(401);
  } else {
    res.locals[AUTH_HEADER] = user.name;
  }
  return next()
});

router.get('/qr', async(req, res, next) => {
  let { query: { cardno } } = req;
  if (!cardno)
    return res.sendStatus(400);
  if (!!(await db.findOne(COLLECTION_NAME_ENV, {
    "role": "credentials",
    "realm": "associate"
  })).entries[res.locals[AUTH_HEADER]])
    res.redirect(`/action/authenticate?cardno=${cardno}`);
  else
    res.redirect(`/action/accredit?cardno=${cardno}`);
});

router.get('/authenticate', async({ query: { cardno }}, res) => {

});

router.get('/accredit', async({ query: { cardno }}, res) => {
  let memberInfo = await db.findOne(COLLECTION_NAME_MEMBER, { cardno }, { "_id": 0, "cardno": 1, "name": 1, "credit": 1 });
  if (!memberInfo)
    return res.render(path.join(__dirname, '..', 'web', 'portal'),
      {
        ...require(path.join(__dirname, '..', 'web', 'pugconfig.json')),
        title: 'CUVita - Portal',
        success: false
      });
  let portal = res.locals[AUTH_HEADER];
  let vendor = await db.findOne(COLLECTION_NAME_VENDOR, { portal }, { "_id": 0, "vendorid": 1, "weight": 1 });
  let transid = db.ObjectId();
  let { vendorid, weight } = vendor;
  await db.updateOne(COLLECTION_NAME_MEMBER, { cardno }, {
    $inc: {
      "credit.cumulative": 1
    },
    $push: {
      'history': {
        'vendorid': vendorid,
        'time': Date.now(),
        'accredited': weight.toFixed(2)
      }
    }
  });
  let { name, credit } = memberInfo;
  if (++credit.tier >= CREDIT_POLICY.goal)
    await db.updateOne(COLLECTION_NAME_MEMBER, { cardno }, {
      $inc: {
        "credit.redeem": 1
      },
      $set: {
        "credit.tier": 0
      }
    })
  else {
    await db.updateOne(COLLECTION_NAME_MEMBER, { cardno }, {
      $inc: {
        "credit.tier": 1
      }
    })
  }
  return res.render(path.join(__dirname, '..', 'web', 'portal'),
    {
      ...require(path.join(__dirname, '..', 'web', 'pugconfig.json')),
      title: 'CUVita - Portal',
      success: true,
      cardno,
      name,
      transid
    });
});

module.exports = router;

/*
{
  users: {
    ...(db.findOne(COLLECTION_NAME_ENV, {
      "role": "credentials",
      "realm": "associate"
    })).entries,
    ...(db.findOne(COLLECTION_NAME_ENV, {
      "role": "credentials",
      "realm": "vendor"
    })).entries
  }
}
*/
