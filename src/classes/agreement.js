class Agreement {

  constructor(baseInstance) {
    this.base = baseInstance;
  }

  /**
  * Create a new aggrement with the user
  * @param {*} data
  * @returns
  */
  async createAgreement(data) {
    data = { ...data, callbackURL: this.base.CALLBACK_URL + '/agreementcallback' };
    return await this.base.req({
      url: '/checkout/create',
      data
    });
  }

  /**
   * Executes a previously created agreement
   * @param paymentID The payment id to create/execute an agreement
   * @returns Agreement object
   */
  async executeAgreement(paymentID) {
    const data = await this.base.req({
      url: '/checkout/execute',
      data: { paymentID }
    });

    /*
      only for testing
      this.agreementID = data.agreementID
    */
    return data
  }

  /**
   * Queries a previously created agreement
   * @param agreementID ID of the already created agreement
   * @returns Agreement object
   */
  async queryAgreement(agreementID) {
    return await this.base.req({
      url: '/checkout/agreement/status',
      data: { agreementID }
    });
  }

  /**
   * Cancels a previously created agreement
   * @param agreementID ID of the already created agreement
   * @returns Agreement object
   */
  async cancelAgreement(agreementID) {
    return await this.base.req({
      url: '/checkout/agreement/cancel',
      data: { agreementID }
    });
  }
}

module.exports = Agreement;