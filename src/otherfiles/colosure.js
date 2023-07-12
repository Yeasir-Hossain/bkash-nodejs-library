require('dotenv').config();
const axios = require('axios');

const username = process.env.BKASH_USERNAME;
const passwd = process.env.BKASH_PASSWORD;
const appKey = process.env.BKASH_APP_KEY;
const appSecret = process.env.BKASH_APP_SECRET;

function Bkash(username, password, appKey, appSecret, isDev) {
  const SANDBOX_URL = 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized';
  const LIVE_URL = '';
  const URL = !isDev ? SANDBOX_URL : LIVE_URL;

  function init() {
    return axios({
      url: URL + '/checkout/token/grant',
      method: 'POST',
      headers: {
        username,
        password
      },
      data: {
        app_key: appKey,
        app_secret: appSecret,
      }
    }).then(function ({ data }) {
      this.refreshToken = data.refresh_token;
      this.idToken = data.id_token;
    }.bind(this)).catch(function (err) { console.log(err); });
  }

  return this;
}


(async function () {
  const b = new Bkash(username, passwd, appKey, appSecret);
  // Initialize Bkash
  // await b.init();
  console.log(b);
})();