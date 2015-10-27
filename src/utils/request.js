/**
 * SDK内部上报数据类
 * 会记录请求响应成功失败次数、限制发送频率
 */

import ajax from '../compats/ajax.js'
import * as utils from '../libs/utils.js'
import * as defaults from '../defaults.js'
import * as onlineTimer from './onlineTimer.js'

// 上次请求发生时间
var lastRequestTime = 0

export var failedCount = 0

export var reportCount = 0

export default function(opts, force) {
  var now = Date.now()

  /**
   * 频率控制
   * 强制上报的请求不受限制
   */
  if (!force) {
    if (lastRequestTime && (now - lastRequestTime < defaults.ASAP_TIMEOUT)) {
      utils.log('Request dropped: unexpected behavior')
      return
    }

    lastRequestTime = now
  }

  reportCount += 1

  ajax({
    url: opts.url,
    data: opts.data,
    success: (xhr, elapsed) => {
      utils.attempt(opts.success, xhr, [xhr, elapsed])
    },
    error: (xhr, elapsed, isTimeout) => {
      failedCount += 1
      utils.attempt(opts.error, xhr, [xhr, elapsed, isTimeout])
    },
    complete: (xhr, elapsed) => {
      utils.attempt(opts.complete, xhr, [xhr, elapsed])

      /**
       * 重新设置定时器
       */
      if (!xhr.getAllResponseHeaders || !xhr.getResponseHeader) return

      var headers = xhr.getAllResponseHeaders()
      var header = 'X-Rate-Limit'
      if (headers.indexOf(header) === -1) return

      var interval = utils.parseInt(xhr.getResponseHeader(header))
      if (interval > 1) {
        onlineTimer.reset(interval * 1000)
      }
    }
  })
}
