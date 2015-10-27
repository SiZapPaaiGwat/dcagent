/**
 * 错误日志上报
 * 默认关闭
 */

import {window} from '../globals.js'
import * as utils from '../libs/utils.js'
import stateCenter from './stateCenter.js'
import * as dataCenter from './dataCenter.js'

export default function() {
  window.addEventListener && window.addEventListener('error', function(e) {
    utils.attempt(function() {

      var params = {}
      var keys = ['colno', 'filename', 'lineno', 'message']
      keys.forEach(i => params[i] = e[i] || '1')

      var error = e.error || {}
      params.stack = encodeURIComponent(error.stack || error.stacktrace || '')
      params.type = error.name || 'Error'
      params.timestamp = parseInt(e.timeStamp / 1000)

      // 支持在错误发生时由用户自定义信息搜集
      if (utils.isFunction(stateCenter.getErrorScene)) {
        var customMsg = utils.attempt(stateCenter.getErrorScene, error, [e])
        if (customMsg) {
          // 如果是对象按行转换成a=b
          if (utils.isObject(customMsg)) {
            var details = ''
            for(var key in customMsg) {
              details += `\t${key}=${customMsg[key]}\n`
            }

            customMsg = details
          } else {
            customMsg = String(customMsg)
          }

          params.stack += `\n\nError scene:\n${encodeURIComponent(customMsg)}`
        }
      }

      dataCenter.addError(params)
    })
  }, false)
}
