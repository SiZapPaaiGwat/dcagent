import onEvent from './onEvent.js'
import * as utils from '../libs/utils.js'
import * as CONST from '../consts.js'
import config from '../utils/initConfig.js'

/**
 * 记录升级耗时
 */
export default function onLevelUp(startLevel, endLevel, elapsed) {
  startLevel = utils.parseInt(startLevel)
  endLevel = utils.parseInt(endLevel)
  elapsed = utils.parseInt(elapsed)

  if (startLevel < 0 || endLevel < 0 || startLevel > endLevel || elapsed < 0) {
    utils.tryThrow('Argument error')
    return false
  }

  config.roleLevel = endLevel

	onEvent(CONST.EVT_LEVEL, {
		startLevel: startLevel,
		endLevel: endLevel,
		duration: elapsed
	})
}
