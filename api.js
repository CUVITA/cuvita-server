const path = require('path');
const app = require('express')();
require('log-timestamp');

/**
 * [PORT description]
 * @type {Number}
 */
const PORT = 8081;

/**
 * CUVita Server Side Implementations - Main Thread
 * @version 0.1.6
 */

app.listen(PORT, () => console.log(`API started on port ${ PORT }`));

app.use('/dispatch', require(path.join(__dirname, 'service_modules', 'dispatch')));
app.use('/feed', require(path.join(__dirname, 'service_modules', 'feed')));
// app.use('/article', require(path.join(__dirname, 'service_modules', 'article')));
// app.use('/vendor', require(path.join(__dirname, 'service_modules', 'vendor')));
// app.use('/member', require(path.join(__dirname, 'service_modules', 'member')));
// app.use('/action', require(path.join(__dirname, 'service_modules', 'action')));
// app.use('/arrival', require(path.join(__dirname, 'service_modules', 'arrival')));

/**
 * Error handling
 */
app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
})
