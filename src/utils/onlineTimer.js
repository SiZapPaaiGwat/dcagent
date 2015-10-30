/**
 * 在线定时器
 */

import Timer from '../libs/timer.js'
import {setTimeout} from '../compats/xTimeout.js'
import stateCenter from './stateCenter.js'

var timer

/**
 * 等待一个周期再启动Timer
 */
export function reset(interval) {
  if (timer) {
    timer.stop()
    setTimeout(() => {
      timer.reset(interval)
    }, interval)

    if (interval) {
      stateCenter.interval = interval
    }
  }
}

export function set(func, interval) {
  timer = new Timer(func, interval)
}

export function get() {
  return timer
}

/**
 * 停止定时器上报
 */
export function destroy() {
  // 如果未初始化或者初始化未成功这里的timer为空
  if (timer) {
    timer.cancel()
    timer = null
  }
}
