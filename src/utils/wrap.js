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
import {setTimeout, clearTimeout} from '../compats/xTimeout'
import * as defaults from '../defaults.js'
import config from '../utils/initConfig.js'

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
  }, defaults.ASAP_TIMEOUT)
}

export function checkInit() {
  var isInited = State.inited === true
  if (!isInited) {
    log('DCAgent.init needed with an appid')
  }

  return isInited
}

