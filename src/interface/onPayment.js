import * as utils from '../libs/utils.js'
import onlinePolling from '../utils/onlinePolling.js'

export default function onPayment(opts) {
	if (!opts || !opts.hasOwnProperty('amount')) {
		return
	}

  onlinePolling(true, {
    currencyAmount: parseFloat(opts.amount, 10) || 0,
    currencyType: opts.currencyType || 'CNY',
    payType: String(opts.payType || ''),
    iapid: String(opts.iapid || ''),
    payTime: utils.parseInt(Date.now() / 1000),
    extendMap: {
      orderId: String(opts.orderId || '')
    }
  })
}
