const axios = require('axios');

class Base {
  constructor(username, password, appKey, appSecret, callbackUrl, isDev) {
    this.SANDBOX_URL = 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized';
    this.LIVE_URL = '';
    this.URL = !isDev ? this.SANDBOX_URL : this.LIVE_URL;
    this.CALLBACK_URL = callbackUrl;

    // Construct creds
    this.username = username;
    this.password = password;
    this.appKey = appKey;
    this.appSecret = appSecret;
  }

  async init() {
    return new Promise(r => {
      this.req({
        url: '/checkout/token/grant',
        data: {
          app_key: this.appKey,
          app_secret: this.appSecret,
        }
      }).then((data) => {
        this.refreshToken = data.refresh_token;
        this.idToken = data.id_token;
        r(this);
      }).catch(function (err) { console.log(err); });
    })
  }

  /**
   * Request to bkash api
   * @param param Request Object
   * @param param.url URL to request
   * @param param.data Request Body
   * @returns Response object
   */
  async req({ url, data }) {
    try {
      let headers = {};
      if (url.endsWith('grant') || url.endsWith('refresh')) headers = { username: this.username, password: this.password };
      else headers = { authorization: this.idToken, 'x-app-key': this.appKey };

      const res = await axios({ method: 'POST', url: this.URL + url, headers, data });
      return res.data;
    } catch (e) { console.log(e); }
  }
}

module.exports = Base;