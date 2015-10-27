import * as utils from '../libs/utils.js'
import * as CONST from '../consts.js'
import * as defaults from '../defaults.js'
import config from '../utils/initConfig.js'
import * as onlineTime from '../utils/onlineTimer.js'
import onlinePolling from '../utils/onlinePolling.js'
import stateCenter from '../utils/stateCenter.js'

/**
 * 连续多次调用login会切换帐户
 * 由于login存在异步请求，所以依赖于login的接口需要判断loginStatus
 */
export default function login(accountID) {
	if (!accountID) {
		utils.tryThrow('Missing accountID')
		return
	}

  stateCenter.loginTime = utils.parseInt(Date.now() / 1000)

	// 重新设置不会起作用
	if (config.accountId === accountID) {
    return
  }

  var timer = onlineTime.get()
  timer.stop()

  // 上报上个用户的所有数据
  onlinePolling(true)

  // 清除上次用户设置
  var accountBaseSettings = CONST.ACCOUNT_RELATED_SETTINGS + ',' + CONST.ACCOUNT_ROLE_SETTINGS
  accountBaseSettings.split(',').forEach(x => config[x] = '')

  // 以下设置需设置为默认值
  config.age = defaults.DEFAULT_AGE
  config.gender = defaults.DEFAULT_GENDER
  config.roleLevel = defaults.DEFAULT_ROLE_LEVEL
  config.accountId = accountID

  // 立即执行一次在线上报
  timer.reset()
}
