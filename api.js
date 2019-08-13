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

/**
 * Service Modules
 */
app.use('/dispatch', require(path.join(__dirname, 'service_modules', 'dispatch')));
app.use('/member', require(path.join(__dirname, 'service_modules', 'member')));
app.use('/cashier', require(path.join(__dirname, 'service_modules', 'cashier')));
app.use('/field', require(path.join(__dirname, 'service_modules', 'field')));
app.use('/vendor', require(path.join(__dirname, 'service_modules', 'vendor')));
app.use('/article', require(path.join(__dirname, 'service_modules', 'article')))

/**
 * Error handling
 */
app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
})
