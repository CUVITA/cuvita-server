const router = require('express').Router();
const database = require(`${ process.cwd() }/utils/database`);
const validator = require('express-validator');
const axios = require('axios');

/**
 * CUVita Server Side Implementations - Auto API
 * @author relubwu
 * @version 0.2.2
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
const generateImage = (url, stockNumber) => {
  let components = url.substring(8).split('/');
  let no = components[4], obs = components[5];
  return `https://img2.carmax.com/img/vehicles/${ stockNumber }/${ no }/${ obs }/375.jpg`;
}
const imageSlice = 10;

router.get('/makes', async (req, res) => {
  return res.json(require(`${ process.cwd() }/statics/auto-makes.json`));
});

router.get('/lists/:make/:region', validator.query('skip').exists().toInt(), async (req, res) => {
  if (validator.validationResult(req).errors.length) return res.status(400).end();
  let { params: { make, region }, query: { skip } } = req;
  let { zipCode } = await database.findOne('regions', { alias: region });
  let { data: { items } } = await axios.get(forgeListURL(make, zipCode, skip));
  for (let item in items) {
    items[item].thumbnail = generateThumbnail(items[item].stockNumber);
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
    delete items[item].isComingSoon;
    delete items[item].comingSoonDate;
  }
  return res.json(items);
});

router.get('/detail/:stockNumber', async ({ params: { stockNumber } }, res) => {
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
    images.push(generateImage(photo.url, vehicle.stockNumber));
  delete vehicle.photos;
  for (let feature in vehicle.keyFeatures)
    vehicle.keyFeatures[feature] = vehicle.keyFeatures[feature].name;
  return res.json({ ...vehicle, tel: vehicleStore.primaryPhoneNumber, images: images.slice(0, imageSlice) });
});

module.exports = router;
