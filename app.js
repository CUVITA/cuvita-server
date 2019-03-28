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

app.use(require('serve-favicon')(path.join(__dirname, 'web', 'favicon.ico')));

app.set('view engine', 'pug');
app.get('/', async (req, res) => {
  return res.render(path.join(__dirname, 'web', 'index'),
    require(path.join(__dirname, 'web', 'pugconfig.json')))
});
app.get('/login', async (req, res) => {
  return res.render(path.join(__dirname, 'web', 'login'),
    { ...require(path.join(__dirname, 'web', 'pugconfig.json')), title: 'CUVita - Login' });
});
app.post('/login', require(path.join(__dirname, 'service_modules', 'login')));
app.get('/portal', async (req, res) => {
  return res.render(path.join(__dirname, 'web', 'portal'),
    require({
      ...path.join(__dirname, 'web', 'pugconfig.json'),
      title: 'CUVita - Portal'
    }))
})

app.use('/dispatch', require(path.join(__dirname, 'service_modules', 'dispatch')));
app.use('/feed', require(path.join(__dirname, 'service_modules', 'feed')));
app.use('/article', require(path.join(__dirname, 'service_modules', 'article')));
app.use('/vendor', require(path.join(__dirname, 'service_modules', 'vendor')));
app.use('/member', require(path.join(__dirname, 'service_modules', 'member')));

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
})
