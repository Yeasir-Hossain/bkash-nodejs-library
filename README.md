# Bkash Integration Library Readme

## Introduction

This Node.js library facilitates the integration of the bKash payment gateway into your application. It supports key functionalities such as creating agreements, processing payments, and managing transactions.

## Installation

To use this library in your Node.js project, follow these steps:

1. Install the library using npm:

    ```bash
    npm install
    ```

2. Create a `.env` file in the root of your project and provide the necessary environment variables:

    ```env
    BKASH_USERNAME=your_bkash_username
    BKASH_PASSWORD=your_bkash_password
    BKASH_APP_KEY=your_bkash_app_key
    BKASH_APP_SECRET=your_bkash_app_secret
    PORT=5000
    ```

## Usage

To use the library in your application, follow these steps:

1. Initialize the library by calling the `run()` function:

    ```javascript
    run().catch(console.dir);
    ```

2. Implement the necessary routes in your Express application:

    - `/agreement`: Initiates the creation of a bKash agreement.
    
    - `/agreementcallback`: Callback endpoint for handling the result of the agreement creation.
    
    - `/queryagreement/:agreementID`: Queries the status of a bKash agreement.
    
    - `/cancelagreement/:agreementID`: Cancels a bKash agreement.
    
    - `/payment/:agreementID`: Initiates a payment using a previously created bKash agreement.
    
    - `/paymentcallback`: Callback endpoint for handling the result of a payment.
    
    - `/querypayment/:paymentID`: Queries the status of a payment.
    
    - `/searchtransaction/:trxID`: Queries a transaction based on the provided transaction ID.
    
    - `/refund`: Initiates a refund for a payment.
    
    - `/refundstatus`: Queries the status of a refund.

3. Customize the routes as needed for your specific use case.

## Example

Here is a basic example of using the library to create a bKash agreement and process a payment:

```javascript
// ... (previous code)

// agreement
app.get('/agreement', async (req, res) => {
  const response = await agreement.createAgreement({
    mode: '0000',
    payerReference: '01770618575'
  });
  res.redirect(response.bkashURL);
});

// ... (more routes)

// payment
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
});

// ... (more routes)

// ... (rest of the code)
```

## License

This library is licensed under the MIT License - see the LICENSE file for details.