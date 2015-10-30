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
export default function onCoinUse(useNum, balanceNum, coinType, reason) {
	balanceNum = utils.parseInt(balanceNum)
	useNum = utils.parseInt(useNum)

	if (balanceNum < 0 || useNum < 0) {
		utils.tryThrow('Argument error')
		return false
	}

	onEvent(CONST.EVT_COIN, {
		actionType: 'coinUse',
		coinType: String(coinType),
		balanceNum: balanceNum,
		coinNum: useNum,
		reason: String(reason)
	})
}
