/**
 * NPM Packages
 * @package express - CC BY-SA 3.0 US - expressjs.com
 * @package mongodb - Apache License 2.0 - npmjs.com/package/mongodb
 */
const path = require('path');
const https = require('https');
const express = require('express');

/**
 * CUVita Server Side Implementations - Main Thread
 * @author relubwu
 * @version 0.1.5
 * @copyright  © CHINESE UNION 2019
 */

const app = express();

https.createServer(require('./ssl'), app).listen(443, () => {
  //console.log('CUVITA SERVER MODULES VERSION 0.1.5');
  console.log(`Application started at ${new Date().toUTCString()}`);
});

app.set('view engine', 'pug');
app.get('/', (req, res) =>
  res.render(path.join(__dirname, 'web', 'index'),
  require(path.join(__dirname, 'web', 'pugconfig.json')))
);

app.use('/dispatch', require('./service_modules/dispatch'));
app.use('/feed', require('./service_modules/feed'));
app.use('/article', require('./service_modules/article'));
