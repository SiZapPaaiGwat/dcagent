import onEvent from './onEvent.js'
import * as utils from '../libs/utils.js'
import * as CONST from '../consts.js'
import config from '../utils/initConfig.js'

/**
 * 记录升级耗时
 * @param startLevel
 * @param endLevel
 * @param elapsed
 */
export default function onLevelUp(startLevel, endLevel, elapsed) {
  endLevel = utils.parseInt(endLevel)
  config.roleLevel = endLevel

	onEvent(CONST.EVT_LEVEL, {
		startLevel: utils.parseInt(startLevel),
		endLevel: endLevel,
		duration: utils.parseInt(elapsed)
	})
}
