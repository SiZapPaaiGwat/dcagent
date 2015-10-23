/**
 * 统一封装的获取key
 */

import * as Client from '../detect/client.js'
import {CLIENT_KEY} from '../consts.js'
import config from './initConfig.js'

export default function(key) {
  // 设备ID不加APPID前缀，方便跨app定位用户
  if (Client.isStandardBrowser || CLIENT_KEY === key) {
    return key
  }

  // egret的localStorage是跨APP共享的，所以需要自己完成数据隔离
  return config.appId + '.' + key
}
