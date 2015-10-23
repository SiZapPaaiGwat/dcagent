/**
 * 数据存储中心
 */

import config from './initConfig.js'
import * as defaults from '../defaults.js'
import * as CONST from '../consts.js'
import * as storage from './storage.js'
import * as utils from '../libs/utils.js'
import detectEngine from '../detect/engine.js'

// 错误信息
var errors = []
// 自定义事件信息
var events = []

export function getHeaderInfo() {
  // TODO 获取头部信息（角色等）
  return config
}

export function getOnlineInfo() {
  return {
    loginTime: config.loginTime,
    onlineTime: utils.parseInt(Date.now() / 1000) - config.loginTime,
    extendMap: {
      // 流量来源
      from: config.from,
      // 引擎类型
      engine: detectEngine() || '',
      // 应用名称
      app: config.app
    }
  }
}

/**
 * 搜集本次上报数据
 */
export function collect(payment, reg) {
  var payload = {
    headerInfo: getHeaderInfo(),
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
  // TODO 这里要根据总的错误发生数目来判断，而不是本次上报数目
  if (errors.length >= defaults.MAX_ERROR_COUNT) return

  errors.push(item)
}

export function addEvent(item) {
  events.push(item)
}
