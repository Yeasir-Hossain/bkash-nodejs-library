require('dotenv').config();
const express = require('express');
const Bkash = require('./classes/bkash');
const Agreement = require('./classes/agreement');
const Payment = require('./classes/payment');
const Transaction = require('./classes/transaction');
const app = express()
const port = process.env.PORT || 5000
app.use(express.json())

// credentials
const username = process.env.BKASH_USERNAME;
const passwd = process.env.BKASH_PASSWORD;
const appKey = process.env.BKASH_APP_KEY;
const appSecret = process.env.BKASH_APP_SECRET;
const callbackUrl = 'http://localhost:5000';
const isDev = true

async function run() {
  const b = await (new Bkash(username, passwd, appKey, appSecret, callbackUrl)).init();
  const agreement = await new Agreement(b);
  const payment = await new Payment(agreement)
  const transaction = await new Transaction(payment)

  try {
    // agreement
    app.get('/agreement', async (req, res) => {
      const response = await agreement.createAgreement({
        mode: '0000',
        payerReference: '01770618575'
      });
      res.redirect(response.bkashURL);
    });

    // user returned from agreement redirect url 
    app.get('/agreementcallback', async (req, res) => {
      const { paymentID, status } = req.query;

      if (paymentID && status === 'success') {
        var response = await agreement.executeAgreement(paymentID);
        res.json({ paymentID: paymentID, agreementID: response.agreementID });
      } else {
        res.json({ status: status, message: 'Agreement Failed' });
      }
    });

    /**
    * Query a  aggrement with the user
    * @param agreementID
    * @returns
    */
    app.get('/queryagreement/:agreementID', async (req, res) => {
      const { agreementID } = req.params;
      var response = await agreement.queryAgreement(agreementID);
      res.json(response);
    })

    /**
    * Cancels a  aggrement with the user
    * @param agreementID
    * @returns
    */
    app.get('/cancelagreement/:agreementID', async (req, res) => {
      const { agreementID } = req.params;
      var response = await agreement.cancelAgreement(agreementID);
      res.json(response);
    })

    // payment
    /**
    * Create a payment with the user
    * @param agreementID
    * @returns
    */
    app.get('/payment/:agreementID', async (req, res) => {
      const { agreementID } = req.params;
      var response = await payment.createPayment({
        mode: '0001',
        payerReference: '01770618575',
        agreementID: agreementID,
        amount: '5',
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: 'Iphone'
      })
      res.redirect(response.bkashURL)
    })

    // user returned from payment redirect url 
    /**
    * Callback after payment with the user
    * @param paymentID and @param status
    * @returns
    */
    app.get('/paymentcallback', async (req, res) => {
      const { paymentID, status } = req.query;

      if (paymentID && status === 'success') {
        var response = await payment.executePayment(paymentID);
        if (response.statusCode === '2023' && response.statusMessage === 'Insufficient Balance') {
          res.json({ paymentID: paymentID, message: response.statusMessage });
        }
        res.json({ paymentID: paymentID, trxID: response.trxID, status: status });
      } else {
        res.json({ status: status, message: 'Payment Failed' });
      }
    })

    /**
    * Query a payment with the user
    * @param paymentID
    * @returns
    */
    app.get('/querypayment/:paymentID', async (req, res) => {
      const { paymentID } = req.params
      var response = await payment.queryPayment(paymentID);
      res.json(response);
    })

    // transaction
    /**
    * Query a transaction with the user
    * @param trxID from execute payment
    * @returns
    */
    app.get('/searchtransaction/:trxID', async (req, res) => {
      const { trxID } = req.params
      var response = await transaction.searchTransaction(trxID);
      res.json(response);
    })

    /**
    * Refund a transaction
    * @param trxID and @param paymentID from execute payment
    * @returns
    */
    app.get('/refund', async (req, res) => {
      const { paymentID, trxID } = req.query
      var response = await transaction.refundPayment({
        paymentID: paymentID,
        amount: "5",
        trxID: trxID,
        sku: "Iphone",
        reason: "Color not mathched",
      });
      res.json(response);
    })

    /**
    * Query a refund
    * @param trxID and @param paymentID from refund
    * @returns
    */
    app.get('/refundstatus', async (req, res) => {
      const { paymentID, trxID } = req.query
      var response = await transaction.refundStatus({
        paymentID: paymentID,
        trxID: trxID,
      });
      res.json(response);
    })


  } catch (error) {
    console.log(error);
  }
  finally {

  }

}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.json({ message: 'Server Running', status: 'OK!' })
})

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}/`)
})
