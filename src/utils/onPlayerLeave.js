/**
 * 在玩家关闭页面时进行一些处理工作
 */
import {window} from '../globals.js'

function getLeavingEvent() {
  var props = ['pagehide', 'beforeunload', 'unload']
  for(var i = 0; i < props.length; i += 1) {
    if(('on' + props[i]) in window) return props[i]
  }
}

export default function(cb) {
  if (window.addEventListener) {
    var eventName = getLeavingEvent()
    if (eventName) {
      window.addEventListener(eventName, cb)
    }
  }
}
