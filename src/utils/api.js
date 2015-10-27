/**
 * SDK对外接口的预处理
 */

import {setTimeout, clearTimeout} from '../compats/xTimeout.js'
import * as onlineTimer from '../utils/onlineTimer.js'
import * as defaults from '../defaults.js'

var controlTimeoutID

/**
 * 优化接口调用的数据上报
 * 使其尽可能快地批量上报数据
 */
export function debounce() {
  console.log('debounce')
  clearTimeout(controlTimeoutID)

  var timer = onlineTimer.get()
  timer.stop()

  controlTimeoutID = setTimeout(() => {
    timer.run()
  }, defaults.ASAP_TIMEOUT)
}
