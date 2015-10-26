/**
 * 数据存储中心
 */

import config from './initConfig.js'
import * as defaults from '../defaults.js'
import * as CONST from '../consts.js'
import * as storage from '../compats/storage.js'
import * as utils from '../libs/utils.js'
import detectEngine from '../detect/engine.js'
import {device} from '../detect/client.js'
import stateCenter from './stateCenter.js'

// 错误信息
var errors = []
// 自定义事件信息
var events = []
// 已上报错误数
var totalError = 0

for (var key in device) {
  // 优先使用用户配置
  config[key] = config[key] || device[key]
}

export function getOnlineInfo() {
  return {
    loginTime: stateCenter.loginTime,
    onlineTime: (utils.parseInt(Date.now() / 1000) - stateCenter.loginTime) || 1,
    extendMap: {
      // 流量来源
      from: stateCenter.from,
      // 引擎类型
      engine: detectEngine() || '',
      // 应用名称
      app: stateCenter.app
    }
  }
}

/**
 * 搜集本次上报数据
 */
export function collect(payment, reg) {
  var payload = {
    headerInfo: config,
    onlineInfo: getOnlineInfo(),
    // 复制一份防止被清
    errorInfoList: errors.concat(),
    eventInfoList: events.concat()
  }

  if (payment) {
    payload.paymentInfo = payment
  }

  if (reg) {
    payload.userInfo = reg
  }

  return payload
}

export function clear() {
  events.length = 0
  errors.length = 0
}

/**
 * 用户退出时将当前数据保存到本地存储
 */
export function saveToStorage() {
  storage.setItem(CONST.LOGOUT_TIME, utils.parseInt(Date.now() / 1000))

  if (errors.length || events.length) {
    storage.setItem(CONST.QUIT_SNAPSHOT, utils.JSONStringify(collect()))
  }
}

/**
 * 用户进入时从本地存储导入数据
 */
export function loadFromStorage() {
  return utils.JSONParse(storage.getItem(CONST.QUIT_SNAPSHOT))
}

export function addError(item) {
  if (totalError >= defaults.MAX_ERROR_COUNT) return

  errors.push(item)

  totalError += 1
}

export function addEvent(item) {
  events.push(item)
}
