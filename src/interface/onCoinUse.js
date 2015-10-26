import onEvent from './onEvent.js'
import * as utils from '../libs/utils.js'
import * as CONST from '../consts.js'

/**
 * 消耗虚拟币，设置留存总量
 * @param gainNum 消耗数量
 * @param balanceNum 留存总量
 * @param coinType 虚拟币类型
 * @param reason 原因
 */
export default function onCoinUse(gainNum, balanceNum, coinType, reason) {
	onEvent(CONST.EVT_COIN, {
		actionType: 'coinUse',
		coinType: coinType,
		balanceNum: utils.parseInt(balanceNum),
		coinNum: utils.parseInt(gainNum),
		reason: reason
	})
}
