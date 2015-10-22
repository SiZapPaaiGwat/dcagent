/**
 * SDK内部上报数据类
 * 会记录请求响应成功失败次数、限制发送频率
 */

import Ajax from '../compats/ajax.js'
import * as utils from '../libs/utils.js'
import * as defaults from '../defaults.js'
import resetTimer from './resetTimer.js'

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
    if (lastRequestTime && now - lastRequestTime < defaults.ASAP_TIMEOUT) {
      utils.log('request dropped: unexpected behavior happened')
      return
    }

    lastRequestTime = now
  }

  Ajax({
    url: opts.url,
    data: opts.data,
    success: (xhr, elapsed) => {
      utils.attemp(opts.success, xhr, [xhr, elapsed])
    },
    error: (xhr, elapsed, isTimeout) => {
      failedCount += 1
      utils.attemp(opts.error, xhr, [xhr, elapsed, isTimeout])
    },
    complete: (xhr, elapsed) => {
      reportCount += 1
      utils.attemp(opts.complete, xhr, [xhr, elapsed])

      /**
       * 重新设置定时器
       */
      var interval = xhr.getResponseHeader && utils.parseInt(xhr.getResponseHeader('X-Rate-Limit'))
      if (interval >= defaults.MIN_ONLINE_INTERVAL) {
        resetTimer(interval)
      }
    }
  })
}


