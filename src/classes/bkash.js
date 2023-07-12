const Base = require("./base");

class Bkash extends Base {
  constructor(username, password, appKey, appSecret, callbackUrl, isDev) {
    super(username, password, appKey, appSecret, callbackUrl, isDev);
  }
}

module.exports = Bkash;