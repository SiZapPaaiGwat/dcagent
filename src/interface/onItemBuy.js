import onEvent from './onEvent.js'
import * as utils from '../libs/utils.js'
import * as CONST from '../consts.js'

/**
 * 记录关卡内使用虚拟币购买道具
 */
export default function onItemBuy(itemID, itemNum, coinType, coinNum, missionID) {
	itemNum = utils.parseInt(itemNum)
	coinNum = utils.parseInt(coinNum)

	if (itemNum < 0 || coinNum < 0) {
		utils.tryThrow('Argument error')
		return false
	}

	onEvent(CONST.EVT_ITEM, {
		actionType: 'itemBuy',
		itemId: String(itemID),
		itemNum: itemNum,
		coinType: String(coinType),
		coinNum: coinNum,
		// 关卡ID
		missonID: String(missionID)
	})
}
