/**
 * 停止定时器上报
 */
import * as onlineTimer from '../utils/onlineTimer.js'

export default function() {
  var timer = onlineTimer.get()
  // 如果未初始化或者初始化未成功这里的timer为空
  if (timer) {
    timer.cancel()
  }
}
