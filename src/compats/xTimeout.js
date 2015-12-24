import {engine} from '../detect/engine.js'
import {window} from '../globals.js'

var setTimeout = window.setTimeout
var clearTimeout = window.clearTimeout

/**
 * egret 参数略有不同
 * egret.setTimeout貌似有bug，优先使用全局默认的setTimeout
 */
if (engine.isEgret && !setTimeout) {
  setTimeout = (func, time) => {
    window.egret.setTimeout(func, window, time)
  }

  clearTimeout = (id) => {
    window.egret.clearTimeout(id)
  }
}

export {setTimeout, clearTimeout}
