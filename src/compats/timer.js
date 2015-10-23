/**
 * 轮询的定时器
 */

import {engine} from '../detect/engine.js'
import {win as window} from '../globals.js'
import {attemp} from '../libs/utils.js'

var setTimeout = window.setTimeout
var clearTimeout = window.clearTimeout

/**
 * egret 参数略有不同
 */
if (engine.isEgret) {
  setTimeout = (func, time) => {
    window.egret.setTimeout(func, window, time)
  }

  clearTimeout = (id) => {
    window.egret.clearTimeout(id)
  }
}

export {setTimeout, clearTimeout}

/**
 * 参考https://gist.github.com/simongfxu/ca6920a4658b3a4babd6
 * 已改造为不要求轮询周期精度的模式
 * 使用方式
 * var timer = new Timer(func, 2000)
 * 2000ms后自动开始执行，符合JS定时器默认逻辑
 * timer.run()
 * timer.stop()
 * timer.reset(1000)
 */
export default function Timer(fn, duration) {
  /**
   * running期间多次调用会执行多次
   * 下个执行点为轮询执行完毕的duration之后
   */
  this.duration = duration
  this.status = 'running'
  this.timer = setTimeout(() => this.run(), this.duration)

  // 立即执行一次函数
  this.run = () => {
    // 清除上次的定时器
    clearTimeout(this.timer)

    attemp(fn)

    this.timer = setTimeout(() => this.run(), this.duration)
  }

  this.stop = () => {
    this.status = 'stopped'
    clearTimeout(this.timer)
  }

  // reset之后也会立即执行一次
  this.reset = (num) => {
    this.stop()
    this.duration = num
    this.run()
  }
}
