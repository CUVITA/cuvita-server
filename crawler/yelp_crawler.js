/**
 * Created by hsun on 2019-10-31.
 * Usage:
 *    Before you start
 *      add your yelp API key in /config/crawler.json as {apiKey: "..."}
 *      visit: https://www.yelp.com/developers/v3/manage_app
 *
 *    1. Copy Yelp vendor id to vendor_id, line by line
 *    2. execute `node yelp_crawler.js ${realm} < vendor_id` in terminal
 *        (*note: realm is either gourmet or lifestyle)
 *
 *    Or if you only have 1 or 2 vendors to add, simply add these
 *      vendor id(s) as command line arguments
 *    1. execute `node yelp_crawler.js {vendor-id...}` in terminal
 *
 *    After crawling the data, you will end up with the db document
 *      without "description" and its Chinese "name". Please ask CU
 *      team to find people to give the vendor a description and
 *      translate the names and descriptions. Apart from that, either
 *      you or others are going to select the categories for the
 *      restaurant (choose from the 8 available categories)
 *
 *    When they finished the translation, you can insert the
 *      documents to the database
 */
const axios = require('axios');
const apiKey = require('../config/crawler.json').apiKey;
const fs = require('fs');
const readline = require('readline');

function crawl(merchants=[], realm="gourmet") {
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
        "realm" : realm,
        "category" : [
            "asia",
            "chinese",
            "boba",
            "western",
            "fastfood",
            "hotpot",
            "bbq",
            "dimsum"
        ],
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
            merchData.coordinates.longitude,
            merchData.coordinates.latitude
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


const realm = process.argv[2] || "gourmet";
const rl = readline.createInterface({
  input: process.stdin
});

let vendors = [];
rl.on('line', (line) => {
  vendors.push(line)
});

// delay since yelp does not like too many requests
let i = 0;
function crawlWithDelay() {
  setTimeout(() => {
    crawl([vendors[i]], realm);
    i++;
    if (i < vendors.length) {
      crawlWithDelay();
    }
  }, 100);
}
crawlWithDelay();


