/**
 * NOTE
 * 统一封装的获取本地存储键名
 * 最初只是为了防止egret的本地存储共享而设计
 * 后来发现如果一个站点多个appid的话数据会共享
 * 所以在数据存储上统一加上当前的APPID作为前缀
 */

import * as Client from '../detect/client.js'
import * as CONST from '../consts.js'
import config from './initConfig.js'

export default function(key) {
  return config.appId + '.' + key
}
