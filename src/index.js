/**
 * DataEye SDK执行所依赖的相关环境
 * 1) 本地存储localStorage(Cookie可选)
 * 2）基本设备信息（设备id，屏幕宽高）
 * 3）XMLHttpRequest或者功能相同的请求工具
 *
 * 对于web环境设备信息中设备id由sdk内部从服务端分配
 */

import init from './interface/init.js'
import {version} from './interface/version.js'
import player from './interface/player.js'

export {
  init,
  version,
  player
}
