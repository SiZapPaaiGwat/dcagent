/**
 * 在线定时器
 */

import Timer from '../libs/timer.js'
import {setTimeout} from '../compats/xTimeout.js'

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
  }
}

export function set(func, interval) {
  timer = new Timer(func, interval)
}

export function get() {
  return timer
}
