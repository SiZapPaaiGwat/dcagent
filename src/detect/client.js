/**
 * 客户端特性检测以及设备环境识别
 */

import {window, document, location} from '../globals.js'
import hasDOM from '../libs/hasDOM.js'
import {engine} from './engine.js'
import * as defaults from '../defaults.js'

var hasStorage = !!window.localStorage || engine.isEgret || engine.isCocos || engine.isLayabox
var isStandardBrowser = hasDOM()
var hasCookie = isStandardBrowser && ('cookie' in document)
var protocol = location.protocol === 'https:' ? 'https:' : 'http:'

var screenObj = window.screen || {}
var userAgent = (window.navigator && window.navigator.userAgent) || ''
// 未知分辨率
var unknownWH = '0*0'
var resolution = screenObj.width && (screenObj.width + '*' + screenObj.height)

/**
 * 如果运行环境不是浏览器
 * 需要SDK初始化时指定brand，osVersion，platform
 */
var brand = '', osVersion = '', platform = defaults.DEFAULT_PLATFORM

if (!userAgent) {
  var platforms = ['ios', 'android']

  if (engine.layabox) {
    var deviceInfo = window.layabox.getDeviceInfo() || {}
    resolution = deviceInfo.resolution || unknownWH
    brand = deviceInfo.phonemodel
    platform = platforms.indexOf(deviceInfo.os.toLowerCase())
    osVersion = (deviceInfo.os + ' ' + deviceInfo.osversion).toLowerCase()
  } else if (engine.cocos) {
    var rect = window.cc.view.getViewPortRect() || {}
    resolution = rect.width + '*' + rect.height
    platform = platforms.indexOf(window.cc.sys.os.toLowerCase())
    // brand和os version也无法取得
  }

  // 未知平台
  if ([0, 1, 2, 3].indexOf(platform) === -1) {
    platform = defaults.DEFAULT_PLATFORM
  }
}

if (!resolution) {
  resolution = unknownWH
}

var device = {resolution, brand, osVersion, platform}

export {hasStorage, isStandardBrowser, hasCookie, protocol, device}
