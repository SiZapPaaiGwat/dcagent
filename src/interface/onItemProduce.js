import onEvent from './onEvent.js'
import * as utils from '../libs/utils.js'
import * as CONST from '../consts.js'

/**
 * 记录关卡内道具产出以及原因
 * @param itemID
 * @param itemNum
 * @param missionID 关卡ID
 * @param reason
 */
export default function onItemProduce(itemID, itemNum, missionID, reason) {
	onEvent(CONST.EVT_ITEM, {
		actionType: 'itemGet',
		itemId: itemID,
		itemNum: utils.parseInt(itemNum),
		missonID: missionID,
		reason: reason
	})
}
