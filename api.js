/**
 * NPM Packages
 * @package express - CC BY-SA 3.0 US - expressjs.com
 * @package mongodb - Apache License 2.0 - npmjs.com/package/mongodb
 */
const path = require('path');
const app = require('express')();
require('log-timestamp');

const PORT = 8081;

/**
 * CUVita Server Side Implementations - Main Thread
 * @author relubwu
 * @version 0.1.5
 * @copyright  © CHINESE UNION 2019
 */

app.listen(PORT, () => console.log(`API started on port ${ PORT }`));

app.use('/dispatch', require(path.join(__dirname, 'service_modules', 'dispatch')));
app.use('/feed', require(path.join(__dirname, 'service_modules', 'feed')));
app.use('/article', require(path.join(__dirname, 'service_modules', 'article')));
app.use('/vendor', require(path.join(__dirname, 'service_modules', 'vendor')));
app.use('/member', require(path.join(__dirname, 'service_modules', 'member')));
app.use('/action', require(path.join(__dirname, 'service_modules', 'action')));
app.use('/arrival', require(path.join(__dirname, 'service_modules', 'arrival')));

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
})
