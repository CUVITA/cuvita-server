const port = require('minimist')(process.argv.slice(2)).p;
const axios = require('axios');

module.exports = {
  get: async function (directory, options) {
    return await axios.get(`http://localhost:${ port }${ directory }`, options);
  },
  port
}
