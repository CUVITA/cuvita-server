/**
 * Created by hsun on 2019-10-31.
 * Usage:
 *    1. Copy Yelp vendor id to vendor_id, line by line
 *    2. execute `node yelp_crawler.js < vendor_id` in terminal
 *
 *    Or if you only have 1 or 2 vendors to add, simply add these
 *      vendor id(s) as command line arguments
 *    1. execute `node yelp_crawler.js {vendor-id...}` in terminal
 *
 *    After crawling the data, you will end up with the db document
 *      without "description" and its Chinese "name". Please ask CU
 *      team to find people to give the vendor a description and
 *      translate the names and descriptions
 *
 *    When they finished the translation, you can insert the
 *      documents to the database
 */
const axios = require('axios');
const apiKey = require('../config/crawler.json').apiKey;
const fs = require('fs');
const readline = require('readline');

function crawl(merchants=[]) {
  merchants.map((merchant) => {
    axios({
      method: 'get',
      baseURL: 'https://api.yelp.com/v3/businesses/',
      url: merchant,
      params: {
        locale: "zh_HK"
      },
      headers: {
        Authorization: apiKey
      }
    }).then((data) => {
      const merchData = data.data;
      let tags = [[],[]];
      for (let i = 0; i < merchData.categories.length; i++) {
        tags[0].push(merchData.categories[i].title);
        tags[1].push(merchData.categories[i].alias)
      }

      const result = {
        "realm" : "gourmet",
        "category" : merchData.categories.map((item)=>{
          return item.alias
        }),
        "tag" : tags,
        "description" : [
          "",
          ""
        ],
        "name" : [
          merchData.name,
          merchData.name
        ],
        "location" : {
          "type" : "Point",
          "coordinates" : [
            merchData.coordinates.latitude,
            merchData.coordinates.longitude
          ]
        },
        "address" : {
          "street" : merchData.location.address1,
          "city" : merchData.location.city,
          "state" : merchData.location.state,
          "zipCode" : merchData.location.zip_code
        },
        "tel" : merchData.display_phone,
        "thumbnail" : merchData.image_url,
        "gallery" : merchData.photos,
        "rating" : merchData.rating,
        "reference" : merchData.id,
        "region" : merchData.location.city
      };
      fs.writeFile(`./vendors/${merchant}.json`, JSON.stringify(result, null, 2), (err)=> err);
    }).catch(function (error) {
      // handle error
      console.log(error);
    });
  });
}

if (process.argv.length > 2) {
  process.argv.forEach((item, idx) => {
    if(idx >= 2)
      crawl([item])
  })
} else {
  const rl = readline.createInterface({
    input: process.stdin
  });

  rl.on('line', (line) => {
    crawl([line])
  });
}

