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
 * @version 0.1.7
 */
app.listen(PORT, () => console.log(`API started on port ${ PORT }`)).on('error', e => {
  if (e.code === 'EADDRINUSE') {
    console.log(`Port ${ PORT } already in use`);
    process.exit();
  } else {
    console.log(`Unexpected error ${ e.code } occured`);
  }
})

/**
 * Service Modules
 */
app.use('/dispatch', require(path.join(__dirname, 'service_modules', 'dispatch')));
app.use('/member', require(path.join(__dirname, 'service_modules', 'member')));
app.use('/cashier', require(path.join(__dirname, 'service_modules', 'cashier')));
app.use('/field', require(path.join(__dirname, 'service_modules', 'field')));
app.use('/region', require(path.join(__dirname, 'service_modules', 'region')));
app.use('/vendor', require(path.join(__dirname, 'service_modules', 'vendor')));
app.use('/article', require(path.join(__dirname, 'service_modules', 'article')));
app.use('/auto', require(path.join(__dirname, 'service_modules', 'auto')));
app.use('/concierge', require(path.join(__dirname, 'service_modules', 'concierge')));

// /**
//  * Error handling
//  */
// app.use((err, req, res, next) => {
//   console.log(err);
//   res.sendStatus(500);
// })
