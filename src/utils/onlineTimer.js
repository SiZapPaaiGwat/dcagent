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
      timer && timer.reset(interval)
    }, interval)

    if (interval) {
      stateCenter.interval = interval
    }
  }
}

/**
 * 停止定时器上报
 */
export function cancel() {
  if (timer) {
    timer.cancel()
    timer = null
  }
}

export function stop() {
  if (timer) {
    timer.stop()
  }
}

export function run() {
  if (timer) {
    timer.run()
  }
}

export function set(func, interval) {
  timer = new Timer(func, interval)
}
