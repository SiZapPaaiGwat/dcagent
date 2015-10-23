/**
 * 在线轮询处理
 */

import request, {failedCount, reportCount} from './request.js'
import * as dataCenter from './dataCenter.js'
import * as CONST from '../consts.js'
import * as Client from '../detect/client.js'
import * as utils from '../libs/utils.js'
import {document} from '../globals.js'
import config from './initConfig.js'
import * as validator from './validator.js'

export default function(force) {
  // 如果文档被隐藏暂时不上报
  if (!force && utils.hiddenProperty && document[utils.hiddenProperty]) return

  var opts = {
    url: Client.protocol + '//' + CONST.HOST
  }

  /**
   * 上报质量统计，每隔多少个周期上报，默认为10
   */
  if (reportCount && reportCount % config.oss === 0) {
    dataCenter.addEvent({
      eventId: CONST.REQ_KEY,
      eventMap: {
        succ: reportCount - failedCount,
        fail: failedCount,
        total: reportCount
      }
    })
  }

  opts.data = dataCenter.collect()

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
