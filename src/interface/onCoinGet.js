import onEvent from './onEvent.js'
import * as utils from '../libs/utils.js'
import * as CONST from '../consts.js'

/**
 * 获取虚拟币，设置留存总量
 * @param gainNum 获取数量
 * @param balanceNum 留存总量
 * @param coinType 虚拟币类型
 * @param reason 原因
 */
export default function onCoinGet(gainNum, balanceNum, coinType, reason) {
	onEvent(CONST.EVT_COIN, {
		actionType: 'coinGet',
		coinType: coinType,
		balanceNum: utils.parseInt(balanceNum),
		coinNum: utils.parseInt(gainNum),
		reason: reason
	})
}
