class Transaction {

    constructor(paymentInstance) {
        this.paymentInstance = paymentInstance;
    }

    /**
    * Search a previous payment done by the user
    * @param trxID The trxID got from the execute payment
    * @returns 
    */
    async searchTransaction(trxID) {
        const response = await this.paymentInstance.agreementInstance.base.req({
            url: '/checkout/general/searchTransaction',
            data: { trxID }
        });
        return response
    }

    /**
   * Do a refund for the previous payment done by the user
   * @param {*} data
   * @returns 
   */
    async refundPayment(data) {
        data = { ...data };
        return await this.paymentInstance.agreementInstance.base.req({
            url: '/checkout/payment/refund',
            data
        });
    }

    /**
 * Search a previous refund status done by the user
 * @param trxID and @param paymentID after the refund payment
 * @returns 
 */
    async refundStatus(data) {
        data = { ...data };
        return await this.paymentInstance.agreementInstance.base.req({
            url: '/checkout/payment/refund',
            data
        });
    }

}

module.exports = Transaction;