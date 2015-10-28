import * as utils from '../libs/utils.js'
import * as CONST from '../consts.js'
import * as defaults from '../defaults.js'
import config from '../utils/initConfig.js'
import * as onlineTimer from '../utils/onlineTimer.js'
import onlinePolling from '../utils/onlinePolling.js'
import stateCenter from '../utils/stateCenter.js'
import * as controller from '../utils/apiController.js'

/**
 * 连续多次调用login会切换帐户
 * 由于login存在异步请求，所以依赖于login的接口需要判断loginStatus
 */
export default function login(accountID) {
	if (!accountID) {
		utils.tryThrow('Missing accountID')
		return
	}

  /**
   * 没有帐号系统的app可以使用uid作为帐户ID
   * DCAgent.login(DCAgent.getUid())
   */
	if (config.accountId === accountID) {
    // 防止两次重新登录导致登录时间不一致
    stateCenter.loginTime = stateCenter.loginTime || utils.parseInt(Date.now() / 1000)
    return
  }

  // 暂停定时器，指定时间段以后开始在线上报
  var timer = onlineTimer.get()
  controller.setPollingDebounce(timer.duration)

  // 上报上个用户的所有数据
  onlinePolling(true)

  stateCenter.loginTime = utils.parseInt(Date.now() / 1000)

  // 清除上次用户设置
  var accountBaseSettings = CONST.ACCOUNT_RELATED_SETTINGS + ',' + CONST.ACCOUNT_ROLE_SETTINGS
  accountBaseSettings.split(',').forEach(x => config[x] = '')

  // 以下设置需设置为默认值
  config.age = defaults.DEFAULT_AGE
  config.gender = defaults.DEFAULT_GENDER
  config.roleLevel = defaults.DEFAULT_ROLE_LEVEL
  config.accountId = accountID

  // 上报当前用户的在线数据
  onlinePolling(true)
}
