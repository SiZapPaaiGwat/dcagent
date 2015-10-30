import onEvent from './onEvent.js'
import * as utils from '../libs/utils.js'
import * as CONST from '../consts.js'

/**
 * 记录关卡内道具产出以及原因
 */
export default function onItemProduce(itemID, itemNum, missionID, reason) {
	itemNum = utils.parseInt(itemNum)

	if (itemNum < 0) {
		utils.tryThrow('Argument error')
		return false
	}

	onEvent(CONST.EVT_ITEM, {
		actionType: 'itemGet',
		itemId: String(itemID),
		itemNum: itemNum,
		reason: String(reason),
		missonID: String(missionID)
	})
}
