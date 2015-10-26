import * as Client from '../detect/client.js'
import * as Engine from '../detect/engine.js'
import * as CONST from '../consts.js'
import * as defaults from '../defaults.js'
import * as utils from '../libs/utils.js'
import FingerPrint from '../libs/fingerprint.js'
import {window} from '../globals.js'

/**
 * 不同的引擎获取不同的前缀
 */
function getPrefix() {
  var timestamp = Date.now().toString(36).toUpperCase()
  var engine = Engine.engine

  // 八位长度的36进制客户端时间戳
  if (engine.egret) {
    return CONST.EGRET_PREFIX + timestamp
  }

  if (engine.layabox) {
    return CONST.LAYA_PREFIX + timestamp
  }

  if (engine.cocos) {
    return CONST.COCOS_PREFIX + timestamp
  }

  return CONST.UNKNOW_ENGINE + timestamp
}

/**
 * 生成唯一的设备ID
 * 只在使用uuid的时候附加前缀，其他情况不附加
 * layabox返回结果
 * {
 *  	resolution:1440*900,
 *  	mac:xxxxx,
 *  	imei:[xxxxx,x],
 *  	imsi:[xx,xx],
 *  	os:android,
 *  	osversion:4.4
 *  	phonemodel:HTC
 *  	idfa:xxxx,
 * }
 */
export default function() {
  var uid

  try {
    if (Client.isStandardBrowser) {
      uid = new FingerPrint({canvas: true, screen_resolution: true, ie_activex: true}).get().toString()
    } else {
      if (Engine.engine.layabox) {
        var deviceInfo = window.layabox.getDeviceInfo() || {}
        uid = deviceInfo.mac || deviceInfo.idfa
        uid = uid && uid.replace(/[-_:=\s]+/g, '').toUpperCase()
      }
    }
  } catch (e) {
    uid = null
  }

  // 不足uid最小长度则补齐
  uid = utils.padding(uid, CONST.PADDING_STRING, defaults.UID_MIN_LENGTH)

  return uid || utils.uuid(getPrefix())
}
