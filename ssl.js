const fs = require('fs');

/**
 * CUVita Server Side Implementations - SSL
 * @author relubwu
 * @version 0.1.5
 * @copyright  © CHINESE UNION 2019
 */

module.exports = {
  pfx: fs.readFileSync('./ssl/cuvita.relubwu.com.pfx'),
  passphrase: fs.readFileSync('./ssl/keystorePass.txt').toString()
}
