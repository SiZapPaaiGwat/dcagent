/**
 * 参考https://gist.github.com/simongfxu/ca6920a4658b3a4babd6
 * 已改造为不要求轮询周期精度的模式
 *
 * 使用方式
 * var timer = new Timer(func, 2000)
 * 2000ms后自动开始执行，符合JS定时器默认逻辑
 *
 * timer.run()
 * timer.stop()
 * timer.reset(1000)
 */

import {setTimeout, clearTimeout} from '../compats/xTimeout.js'
import * as utils from './utils.js'

export default function(fn, duration) {
  /**
   * running期间多次调用会执行多次
   * 下个执行点为轮询执行完毕的duration之后
   */
  this.duration = duration
  this.status = 'running'
  this.timer = setTimeout(() => this.run(), this.duration)

  // 立即执行一次函数
  this.run = () => {
    if (this.status === 'cancelled') return

    // 清除上次的定时器
    clearTimeout(this.timer)

    utils.attempt(fn)

    this.timer = setTimeout(() => this.run(), this.duration)
  }

  this.stop = () => {
    this.status = 'stopped'
    clearTimeout(this.timer)
  }

  // reset之后也会立即执行一次
  this.reset = (num) => {
    if (this.status === 'cancelled') return

    this.stop()
    if (num) {
      this.duration = num
    }
    this.run()
  }

  // 永久停止timer防止被错误启动
  this.cancel = function() {
    this.status = 'cancelled'
    clearTimeout(this.timer)
  }
}
