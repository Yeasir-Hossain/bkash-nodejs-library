require('dotenv').config();
const axios = require('axios');

const username = process.env.BKASH_USERNAME;
const passwd = process.env.BKASH_PASSWORD;
const appKey = process.env.BKASH_APP_KEY;
const appSecret = process.env.BKASH_APP_SECRET;
const callbackUrl = 'http://localhost:3000';

class Bkash {
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


(async function () {
  const b = await (new Bkash(username, passwd, appKey, appSecret, callbackUrl)).init();
  // console.log(b);

  // // Create a new agreement
  var aggreement = await b.createAgreement({
    mode: '0000',
    payerReference: '01770618575'
  });
  console.log(aggreement);

  await new Promise(r => setTimeout(r, 1000 * 60 * 1));
  // Execute the agreement
  var aggreement = await b.executeAgreement(aggreement.paymentID);
  console.log(aggreement);
})();