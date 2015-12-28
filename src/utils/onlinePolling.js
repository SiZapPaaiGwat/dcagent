/**
 * 在线轮询处理
 */

import request, {failedCount, reportCount} from './request.js'
import * as dataCenter from './dataCenter.js'
import * as CONST from '../consts.js'
import * as utils from '../libs/utils.js'
import {document} from '../globals.js'
import stateCenter from './stateCenter.js'
import * as validator from './validator.js'
import * as uri from './uri.js'

export default function(force, payment, reg) {
  // 如果文档被隐藏暂时不上报
  if (!force && utils.hiddenProperty && document[utils.hiddenProperty]) return

  var opts = {
    url: uri.appendOnline(uri.API_PATH)
  }

  var offsetLen = 1

  /**
   * 上报质量统计，每隔多少个周期上报，默认为10
   */
  if (reportCount && (reportCount % stateCenter.oss === 0)) {
    dataCenter.addEvent({
      eventId: CONST.REQ_KEY,
      eventMap: {
        succ: reportCount - failedCount,
        fail: failedCount,
        total: reportCount
      }
    })

    offsetLen += 1
  }

  opts.data = dataCenter.collect(payment, reg)

  // report event immediately if set with immediate
  var recentEvent = opts.data.eventInfoList[opts.data.eventInfoList.length - offsetLen]
  if (recentEvent && recentEvent.eventMap && recentEvent.eventMap.immediate) {
    force = true
  }

  if (!validator.isParamsValid(opts.data)) return

  dataCenter.clear()

  /**
   * 如果上传失败将本次数据回写
   */
  var errors = opts.data.errorInfoList
  var events = opts.data.eventInfoList
  if (events.length || errors.length) {
    opts.error = () => {
      errors.forEach((item) => {
        dataCenter.addError(item)
      })

      events.forEach((item) => {
        dataCenter.addEvent(item)
      })
    }
  }

  request(opts, force)
}
