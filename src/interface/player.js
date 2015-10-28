/**
 * 搜集玩家相关信息
 * 这里的数据SDK暂时不上报
 * 可以在getErrorScene里面上报上来
 */

import {reportCount, failedCount} from '../utils/request.js'
import storage from '../compats/storage.js'
import * as CONST from '../consts.js'
import stateCenter from '../utils/stateCenter.js'

export default {
  get isNew() {
    var loginTime = stateCenter.loginTime || stateCenter.initTime
    return stateCenter.createTime === loginTime
  },
  get initTime() {
    return stateCenter.initTime
  },
  get createTime() {
    return stateCenter.createTime
  },
  get loginTime() {
    return stateCenter.loginTime
  },
  get lastLogoutTime() {
    return parseInt(storage.getItem(CONST.LOGOUT_TIME))
  },
  get reportCount() {
    return reportCount
  },
  get reportFailedCount() {
    return failedCount
  }
}
