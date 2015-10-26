import login from '../interface/login'
import getUid from '../interface/getUid'
import createRole from '../interface/createRole'
import onCoinGet from '../interface/onCoinGet'
import onCoinUse from '../interface/onCoinUse'
import onEvent from '../interface/onEvent'
import onItemBuy from '../interface/onItemBuy'
import onItemProduce from '../interface/onItemProduce'
import onItemUse from '../interface/onItemUse'
import onLevelUp from '../interface/onLevelUp'
import onMissionFinished from '../interface/onMissionFinished'
import onMissionUnfinished from '../interface/onMissionUnfinished'
import onPayment from '../interface/onPayment'
import onTaskFinished from '../interface/onTaskFinished'
import onTaskUnfinished from '../interface/onTaskUnfinished'
import setAccountType from '../interface/setAccountType'
import setAge from '../interface/setAge'
import setGameServer from '../interface/setGameServer'
import setGender from '../interface/setGender'
import setRoleInfo from '../interface/setRoleInfo'
import State from './internal/state'
import {log} from './utils'
import settings from './settings'
import {setTimeout, clearTimeout} from '../compats/xTimeout'
import {ASAP_TIMEOUT} from '../defaults.js'

export var initBasedAPI = {
  login,
  getUid,
  onEvent
}

export var loginBasedAPI = {
  createRole,
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
  setRoleInfo
}

// 登录完成的调用列表
var loginInvokeList = []

/**
 * login内有异步请求，可能导致某些依赖于login的接口过早调用
 * 需要缓存待login完成之后调用
 */
export function cacheBeforeLogin(method) {
  return function() {
    var loginStatus = State.getLoginStatus()

    // 依赖于登录调用
    if (loginStatus === 0) {
      log('DCAgent.login needed')
      return false
    }

    // 调用了login接口，异步请求还没结束
    if (loginStatus === 1) {
      var result = [method];
      [].forEach.call(arguments, i => result.push(i))
      loginInvokeList.push(result)

      return false
    }
  }
}

/**
 * 执行login异步请求过程中调用的接口
 */
export function clearLoginInvokeList() {
  loginInvokeList.forEach(item => loginBasedAPI[item.shift()].apply(0, item))
  loginInvokeList.length = 0
}

var controlTimer

/**
 * 尽可能快地执行主要接口调用：
 * 清楚延迟执行的定时器
 * 暂停轮询timer
 * 设置一个定时器，延迟指定时间后启动轮询timer
 */
export function asap() {
  clearTimeout(controlTimer)

  var timer = settings.timer
  timer.stop()
  controlTimer = setTimeout(function() {
    timer.run()
  }, ASAP_TIMEOUT)
}

export function checkInit() {
  var isInited = State.inited === true
  if (!isInited) {
    log('DCAgent.init needed with an appid')
  }

  return isInited
}

