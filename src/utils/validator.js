import * as defaults from '../defaults.js'
import * as utils from '../libs/utils.js'

/**
 * 验证上报参数是否合法
 */
export function isParamsValid(data) {
  if (!data) return false

  var onlineTime = data.onlineInfo.onlineTime
  if (onlineTime < 1 || onlineTime > defaults.MAX_ONLINE_TIME) {
    utils.log('Illegal online time')
    return false
  }

  return true
}
