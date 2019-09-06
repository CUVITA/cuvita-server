const path = require('path');
const Regions = require(path.join(__dirname, '..', 'config', 'region.json'));

/**
 * CUVita Server Side Implementations - Region Convertion Tool
 * @author relubwu
 * @version 0.2.1
 * @copyright  © CHINESE UNION 2019
 */

module.exports = {
  mapIndexToRegion: function (index) {
    return Regions[index];
  },
  mapIdToRegion: function (id) {
    for (let index in Regions)
      if (Regions[index].id === id)
        return Regions[index];
  }
}
