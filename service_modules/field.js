const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * CUVita Server Side Implementations - Feed Generator
 * @author relubwu
 * @version 0.1.5
 * @copyright  © CHINESE UNION 2019
 */

router.get('/', async({ query: { locale } }, res) => {
  if (!locale)
    return res.sendStatus(400);
  let banners = await db.find("banners", { locale: parseInt(locale) }, {
    "_id": 0,
    "locale": 0
  });

  let referenceList = await db.find(db.COLLECTIONS.RECOMMENDATIONS, {}, {"_id": 0,"locale": 0});

  for (i=0; i<referenceList.length; i++) {
    referenceList[i].title = referenceList[i].title[parseInt(locale)];
    referenceList[i].action = referenceList[i].action[parseInt(locale)];
    for(j=0; j<referenceList[i].items.length; j++) {
      let itemObject = await db.findOne(db.COLLECTIONS.VENDORS,
        { "reference": referenceList[i].items[j] },
        {
          "_id": 0,
          "thumbnail": 1,
          "name": 1,
          "description" :1
        });
        itemObject.name = itemObject.name[parseInt(locale)];
        itemObject.description = itemObject.description[parseInt(locale)];
        itemObject["reference"] = referenceList[i].items[j];
        referenceList[i].items[j] = itemObject;
    }
  }

  let articleList = await db.find(db.COLLECTIONS.ARTICLES, {}, {"_id": 0});

  return res.json({
    banner: banners[Math.floor(Math.random() * banners.length)],
    recommendations: [referenceList[Math.floor(Math.random() * referenceList.length)],
           referenceList[Math.floor(Math.random() * referenceList.length)]],
    article: articleList
  });
});

module.exports = router;
