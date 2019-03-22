/**
 * NPM Packages
 * @package express - CC BY-SA 3.0 US - expressjs.com
 * @package mongodb - Apache License 2.0 - npmjs.com/package/mongodb
 */
const https = require('https');
const express = require('express');
const credentials = require('./ssl');

/**
 * CUVita Server Side Implementations - Main Thread
 * @author relubwu
 * @version 0.1.5
 * @copyright  © CHINESE UNION 2019
 */

const app = express();

https.createServer(credentials, app).listen(443, () =>
  console.log(`Application started at ${new Date().toUTCString()}`)
);
