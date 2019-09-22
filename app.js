const app = require('express')();
require('log-timestamp');

/**
 * CUVita Server Side Implementations
 * @author relubwu
 * @version 0.2.5
 * @copyright  © CHINESE UNION 2019
 */

const port = require('minimist')(process.argv.slice(2)).p;
const database = require('minimist')(process.argv.slice(2)).d;

if (!port || !database) { console.error('Please specify port using -p, database using -d, exiting'); process.exit(); }

app.listen(port, () => console.log(`Application started on ${ port }`)).on('error', e => {
  e.code === 'EADDRINUSE' ? console.error(`Port ${ port } already in use, exiting`) : console.error(`Unexpected error ${ e.code } occured`);
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
app.use('/user', require(`${ process.cwd() }/routers/user`));
