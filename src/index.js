/**
 * DataEye SDK执行所依赖的相关环境
 * 1) 本地存储localStorage(Cookie可选)
 * 2）基本设备信息（设备id，屏幕宽高）
 * 3）XMLHttpRequest或者功能相同的请求工具
 *
 * 对于web环境设备信息中设备id由sdk内部从服务端分配
 */

import stateCenter from './utils/stateCenter.js'
import * as utils from './libs/utils.js'
import {window} from './globals.js'
import * as API from './utils/api.js'
import init from './interface/init.js'
import isReady from './interface/isReady.js'
import {version} from './interface/version.js'
import player from './interface/player.js'
import login from './interface/login.js'
import getUid from './interface/getUid.js'
import onCoinGet from './interface/onCoinGet.js'
import onCoinUse from './interface/onCoinUse.js'
import onEvent from './interface/onEvent.js'
import onItemBuy from './interface/onItemBuy.js'
import onItemProduce from './interface/onItemProduce.js'
import onItemUse from './interface/onItemUse.js'
import onLevelUp from './interface/onLevelUp.js'
import onMissionFinished from './interface/onMissionFinished.js'
import onMissionUnfinished from './interface/onMissionUnfinished.js'
import onPayment from './interface/onPayment.js'
import onTaskFinished from './interface/onTaskFinished.js'
import onTaskUnfinished from './interface/onTaskUnfinished.js'
import setAccountType from './interface/setAccountType.js'
import setAge from './interface/setAge.js'
import setGameServer from './interface/setGameServer.js'
import setGender from './interface/setGender.js'
import setRoleInfo from './interface/setRoleInfo.js'
import createRole from './interface/createRole.js'

var commonAPI = {
  init,
  version,
  player,
  isReady
}

var initBasedAPI = {
  login,
  getUid,
  onEvent
}

var loginBasedAPI = {
  onCoinGet,
  onCoinUse,
  onItemBuy,
  onItemProduce,
  onItemUse,
  onLevelUp,
  onMissionFinished,
  onMissionUnfinished,
  onPayment,
  onTaskFinished,
  onTaskUnfinished,
  setAccountType,
  setAge,
  setGameServer,
  setGender,
  setRoleInfo,
  createRole
}

var name
var preInit = [() => stateCenter.inited]
var preLogin = [() => stateCenter.isLogin]
var debounce = [API.debounce]

for (name in commonAPI) {
  exports[name] = commonAPI[name]
}

/**
 * 校验是否已经初始化
 * onEvent需要debounce
 */
for (name in initBasedAPI) {
  exports[name] = utils.aspect(initBasedAPI[name], preInit, name === 'onEvent' && debounce)
}

/**
 * 校验是否已登录
 * onPayment是立即调用
 * 此处的接口使用内置的onEvent函数
 */
for (name in loginBasedAPI) {
  exports[name] = utils.aspect(loginBasedAPI[name], preLogin, name !== 'onPayment' && debounce)
}

/**
 * 执行快速统计调用
 * dc('init', {...})
 * dc(onEvent, id, data)
 */
var proxyName = window.DCAgentObject
if (proxyName) {
  var proxy = window[proxyName]
  if (utils.isFunction(proxy)) {
    var cache = proxy.cache

    if (cache.length) {
      cache.forEach((args) => {
        utils.attempt(exports[args[0]], exports, utils.slice(args, 1))
      })

      cache.length = 0
    }
  }
}
