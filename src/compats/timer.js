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
 * 来源于https://gist.github.com/simongfxu/ca6920a4658b3a4babd6
 * 现已改造为不要求轮询周期精度的模式
 */
export default function Timer(fn, duration) {
  this.status = 'constructed'

  /**
   * running期间多次调用会执行多次
   * 下个执行点为轮询执行完毕的duration之后
   */
  this.run = function(){
    // 清除上次的定时器
    clearTimeout(this.timer)

    this.status = 'running'

    attemp(fn)

    var self = this
    this.timer = setTimeout(() => self.run(), duration)
  }

  this.stop = function(){
    this.status = 'stopped'
    clearTimeout(this.timer)
  }
}
