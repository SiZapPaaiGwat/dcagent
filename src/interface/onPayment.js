import * as utils from '../libs/utils.js'
import onlinePolling from '../utils/onlinePolling.js'

export default function onPayment(opts) {
	if (!opts || !opts.hasOwnProperty('amount')) {
    utils.tryThrow('Missing amount')
		return
	}

  var sendData = {
    // 1e21经过JSON.stringify会变成 '1e+21'
    currencyAmount: utils.max(parseFloat(opts.amount, 10) || 0),
    currencyType: opts.currencyType || 'CNY',
    payType: String(opts.payType || ''),
    iapid: String(opts.iapid || ''),
    payTime: utils.parseInt(Date.now() / 1000),
    extendMap: {
      orderId: String(opts.orderId || '')
    }
  }

	if (sendData.currencyAmount <= 0) {
		utils.tryThrow('amount must be greater than 0')
		return
	}

  onlinePolling(true, sendData)
  return sendData
}
