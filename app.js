const { env: { NODE_ENV, PORT } } = process;
const app = require('express')();
require('log-timestamp');

/**
 * CUVita Server Side Implementations
 * @author relubwu
 * @version 0.2.2
 * @copyright  © CHINESE UNION 2019
 */

app.listen(PORT, () => console.log(`Application started on ${ PORT }`)).on('error', e => {
  if (e.code === 'EADDRINUSE') {
    console.error(`Port ${ PORT } already in use, exiting`);
  } else {
    console.error(`Unexpected error ${ e.code } occured`);
  }
  process.exit();
});

app.use('/dispatch', require(`${ process.cwd() }/routers/dispatch`));
app.use('/cashier', require(`${ process.cwd() }/routers/cashier`));
app.use('/field', require(`${ process.cwd() }/routers/field`));
app.use('/member', require(`${ process.cwd() }/routers/member`));
app.use('/vendor', require(`${ process.cwd() }/routers/vendor`));
app.use('/auto', require(`${ process.cwd() }/routers/auto`));
app.use('/region', require(`${ process.cwd() }/routers/region`));
app.use('/article', require(`${ process.cwd() }/routers/article`));
app.use('/school', require(`${ process.cwd() }/routers/school`));
app.use('/concierge', require(`${ process.cwd() }/routers/concierge`));
app.use('/user', require(`${ process.cwd() }/routers/user`));
