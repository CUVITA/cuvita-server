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
const AUTH_HEADER = 'X-CUVita-Name';


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
  if (!!(await db.findOne(COLLECTION_NAME_ENV, {
    "role": "credentials",
    "realm": "associate"
  })).entries[res.locals[AUTH_HEADER]])
    res.redirect('/authenticate');
  else
    res.redirect('/accredit');
});

router.get('/authenticate', async(req, res) => {

});

router.get('/accredit', async(req, res) => {

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
