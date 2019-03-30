const path = require('path');
const http = require('http');
const app = require('express')();

/**
 * CUVita Server Side Implementations - API
 * @author relubwu
 * @version 0.1.5
 * @copyright  © CHINESE UNION 2019
 */

const SERVER_URL = "https://cuvita.relubwu.com";

const url = route => {
  return SERVER_URL.concat(route);
}

http.createServer(app).listen(80, () => {
  console.log('=== CUVITA API DEFLECTOR VERSION 0.1.5 ===');
  console.log(`Application started at ${new Date().toUTCString()}`);
});

app.get('/qr', async ({ query: { p }}, res) => {
  if (!p)
    return res.sendStatus(400);
  return res.redirect(url(`/action/qr?cardno=${p}`));
});

app.get('/coupon', async ({ query: { p }}, res) => {
  if (!p)
    return res.sendStatus(400);
  return res.redirect(url(`/action/coupon?id=${p}`));
});
