class Payment {

  constructor(agreementInstance) {
    this.agreementInstance = agreementInstance;
  }

  /**
  * Create a new payment with the user
  * @param {*} data
  * @returns 
  */
  async createPayment(data) {
    data = { ...data, callbackURL: this.agreementInstance.base.CALLBACK_URL + '/paymentcallback' };
    const response = await this.agreementInstance.base.req({
      url: '/checkout/create',
      data
    });
    /*    
    only for testing
    this.paymentID = response.paymentID
    */
    return response
  }

  /**
   * Executes a previously created payment
   * @param paymentID The payment id to create/execute an agreement
   * @returns Agreement object
   */
  async executePayment(paymentID) {
    const response = await this.agreementInstance.base.req({
      url: '/checkout/execute',
      data: { paymentID }
    });
    /*    
    only for testing
    this.trxID = response.trxID
    */
    return response
  }

  /**
   * Queries a previous payment
   * @param paymentID ID of the already created agreement
   * @returns Agreement object
   */
  async queryPayment(paymentID) {
    // data = { ...data, callbackURL: this.base.CALLBACK_URL };
    return await this.base.req({
      url: '/checkout/agreement/status',
      data: { paymentID }
    });
  }

}

module.exports = Payment;