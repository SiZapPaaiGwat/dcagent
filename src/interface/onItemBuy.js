import onEvent from './onEvent.js'
import * as utils from '../libs/utils.js'
import * as CONST from '../consts.js'

/**
 * 记录关卡内使用虚拟币购买道具
 * @param itemID
 * @param itemNum
 * @param coinType
 * @param coinNum
 * @param missionID
 */
export default function onItemBuy(itemID, itemNum, coinType, coinNum, missionID) {
	onEvent(CONST.EVT_ITEM, {
		actionType: 'itemBuy',
		itemId: itemID,
		itemNum: utils.parseInt(itemNum),
		coinType: coinType,
		coinNum: utils.parseInt(coinNum),
		missonID: missionID
	})
}
