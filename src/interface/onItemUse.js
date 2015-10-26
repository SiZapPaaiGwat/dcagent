import onEvent from './onEvent.js'
import * as utils from '../libs/utils.js'
import * as CONST from '../consts.js'

/**
 * 记录关卡内道具消耗以及原因
 * @param itemID
 * @param itemNum
 * @param reason
 * @param missionId
 */
export default function onItemUse(itemID, itemNum, missionID, reason) {
	onEvent(CONST.EVT_ITEM, {
		actionType: 'itemUse',
		itemId: itemID,
		itemNum: utils.parseInt(itemNum),
		reason: reason,
		missonID: missionID
	})
}
