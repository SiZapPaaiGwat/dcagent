import * as defaults from '../defaults.js'
import * as utils from '../libs/utils.js'
import stateCenter from './stateCenter.js'

/**
 * 验证上报参数是否合法
 */
export function isParamsValid(data) {
  if (!data) return false

  var onlineTime = data.onlineInfo.onlineTime
  if (onlineTime < 1 || onlineTime > defaults.MAX_ONLINE_TIME) {
    utils.tryThrow('Illegal online time')
    return false
  }

  return true
}

export function shouldBeInited() {
  if (!stateCenter.inited) {
    utils.tryThrow('DCAgent.init needed')
    return false
  }
}

export function shouldBeLoggedIn() {
  if (!stateCenter.loginTime) {
    utils.tryThrow('DCAgent.login needed')
    return false
  }
}
