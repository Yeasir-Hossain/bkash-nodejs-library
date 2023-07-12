require('dotenv').config();
const axios = require('axios');

const Bkash = function (username, password, appKey, appSecret, isDev) {
  const SANDBOX_URL = 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized';
  const LIVE_URL = '';
  const URL = !isDev ? SANDBOX_URL : LIVE_URL;

  const bkash = {
    refreshToken: '',
    idToken: '',
    init: function () {
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
    },
    agreement: {
      create: function () { },
      search: function () { },
      execute: function () { },
    }
  };


  return bkash;
};


const username = process.env.BKASH_USERNAME;
const passwd = process.env.BKASH_PASSWORD;
const appKey = process.env.BKASH_APP_KEY;
const appSecret = process.env.BKASH_APP_SECRET;

(async function () {
  const b = new Bkash(username, passwd, appKey, appSecret);
  // Initialize Bkash
  await b.init();
  console.log(b);
})();
