const path = require('path');
const axios = require('axios');
const router = require('express').Router();
const { mapIdToRegion } = require(path.join(__dirname, '..', 'utils', 'region-converter'));

/**
 * CUVita Server Side Implementations - CarMax Scrapper
 * @author relubwu
 * @version 0.2.1
 * @copyright  © CHINESE UNION 2019
 */

const forgeListURL = (make, zipCode, skip=0, sort=20, take=10, radius=50) => {
  return `https://www.carmax.com/cars/api/search/run?uri=%2Fcars%2F${ make }&skip=${ skip }&take=${ take }&radius=${ radius }&zipCode=${ zipCode }&sort=${ sort }`;
}
const forgeDetailURL = (stockNumber) => {
  return `https://shoppersapp-gateway.carmax.com/api/vehicles/${ stockNumber }`;
}
const generateThumbnail = (stockNumber) => {
  return `https://img2.carmax.com/image/${ stockNumber }`;
}
const generateProxyThumbnail = (stockNumber) => {
  return `https://api.cuvita.net/auto/thumbnail?stockNumber=${ stockNumber }`;
}
const generateImage = (stockNumber, no, obs) => {
  return `https://img2.carmax.com/img/vehicles/${ stockNumber }/${ no }/${ obs }/375.jpg`;
}
const generateProxyImage = (url, stockNumber) => {
 let components = url.substring(8).split('/');
 let no = components[4], obs = components[5];
 return `https://api.cuvita.net/auto/image?stockNumber=${ stockNumber }&no=${ no }&obs=${ obs }`;
}

router.get('/lists', async ({ query: { make, region, skip } }, res) => {
  if (!make || !region)
    return res.sendStatus(400);
  let { data: { items } } = await axios.get(forgeListURL(make, mapIdToRegion(region).zipCode, parseInt(skip)));
  for (let item in items) {
    items[item].thumbnail = generateProxyThumbnail(items[item].stockNumber);
    delete items[item].storeCity;
    delete items[item].geoCity;
    delete items[item].state;
    delete items[item].stateAbbreviation;
    delete items[item].numberOfReviews;
    delete items[item].isNewArrival;
    delete items[item].lastMadeSaleableDate;
    delete items[item].transferFee;
    delete items[item].transferTags;
    delete items[item].transferText;
    delete items[item].highlights;
    delete items[item].review;
    delete items[item].hasPremiumFeatures;
    delete items[item].featureScore;
    delete items[item].isTransferable;
    delete items[item].highlightedFeatures;
  }
  return res.json({ [make]: items });
});

router.get('/thumbnail', async({ query: { stockNumber } }, res) => {
  axios({
    method: 'GET',
    url: generateThumbnail(stockNumber),
    responseType: 'arraybuffer'
  })
    .then(({ data }) => {
      res.contentType('image/jpeg');
      return res.end(Buffer.from(data), 'base64');
    })
    .catch(e => {
      return res.sendStatus(404);
    })
});

router.get('/makes', async(req, res) => {
  let { makes } = require(path.join(__dirname, '..', 'statics', 'auto-makes.json'))
  return res.json(makes);
});

router.get('/detail', async({ query: { stockNumber } }, res) => {
  if (!stockNumber)
    return res.sendStatus(400);

  let { data: { vehicle, vehicleStore } } = await axios.get(forgeDetailURL(stockNumber));

  delete vehicle.status;
  delete vehicle.isNew;
  delete vehicle.lastMadeSaleableDate;
  delete vehicle.lastUpdateDate;
  delete vehicle.isTransferable;
  delete vehicle.isNewArrival;
  delete vehicle.highlights;
  delete vehicle.newTireCount;

  let images = [];
  for (let photo of vehicle.photos.photos)
    images.push(generateProxyImage(photo.url, vehicle.stockNumber));
  delete vehicle.photos;

  for (let feature in vehicle.keyFeatures)
    vehicle.keyFeatures[feature] = vehicle.keyFeatures[feature].name;

  return res.json({ ...vehicle, tel: vehicleStore.primaryPhoneNumber, images: images.slice(0, 10) });
});

router.get('/image', async({ query: { stockNumber, no, obs } }, res) => {
  axios({
    method: 'GET',
    url: generateImage(stockNumber, no, obs),
    responseType: 'arraybuffer'
  })
    .then(({ data }) => {
      res.contentType('image/jpeg');
      return res.end(Buffer.from(data), 'base64');
    })
    .catch(e => {
      return res.sendStatus(404);
    })
});

module.exports = router;
