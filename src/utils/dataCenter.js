/**
 * 数据存储中心
 */

import config from './initConfig.js'
import * as defaults from '../defaults.js'
import * as CONST from '../consts.js'
import * as storage from './storage.js'
import * as utils from '../libs/utils.js'
import detectEngine from '../detect/engine.js'
import stateCenter from './stateCenter.js'

// 错误信息
var errors = []
// 自定义事件信息
var events = []
// 已上报错误数
var totalError = 0

export function getHeaderInfo() {
  // TODO 获取头部信息（角色等）
  // accountId: "19541788390A0A0A0A0A0A0A0A0A0A0A"
  // accountType: ""
  // age: 0
  // appId: "C4BD90A91FE340AAE1ECB1852D1D12E8"
  // appVersion: ""
  // brand: ""
  // channel: "wexin"
  // customDeviceId: ""
  // gameServer: ""
  // gender: 0
  // idfa: ""
  // imei: ""
  // lonLat: ""
  // mac: ""
  // netType: 3
  // operator: ""
  // osVersion: ""
  // platform: 0
  // resolution: "1440*900"
  // roleClass: ""
  // roleId: ""
  // roleLevel: 0
  // roleRace: ""
  // simCardOp: ""
  // uid: "19541788390A0A0A0A0A0A0A0A0A0A0A"
  // ver: 23
  return config
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
  if (totalError >= defaults.MAX_ERROR_COUNT) return

  errors.push(item)

  totalError += 1
}

export function addEvent(item) {
  events.push(item)
}
