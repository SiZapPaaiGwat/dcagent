/**
 * 在线定时器
 */

import Timer from '../libs/timer.js'

var timer

export function resetTimer(interval) {
  if (timer) {
    timer.reset(interval)
  }
}

export function createTimer(func, interval) {
  timer = new Timer(func, interval)
}

export function getTimer() {
  return timer
}
