/**
 * SDK初始化
 */

import {document, location} from '../globals.js'
import * as utils from '../libs/utils.js'
import * as CONST from '../consts.js'
import * as defaults from '../defaults.js'
import * as Client from '../detect/client.js'
import stateCenter from '../utils/stateCenter.js'
import * as dataCenter from '../utils/dataCenter.js'
import * as innerStorage from '../utils/storage.js'
import storage from '../compats/storage.js'
import config from '../utils/initConfig.js'
import onlinePolling from '../utils/onlinePolling.js'
import * as onlineTimer from '../utils/onlineTimer.js'
import getUID from '../compats/uid.js'
import onError from '../utils/onError.js'
import onPlayerLeave from '../utils/onPlayerLeave.js'
import request from '../utils/request.js'
import * as uri from '../utils/uri.js'
import * as validator from '../utils/validator.js'

/**
 * 验证用户参数
 */
function checkArguments(options) {
  /**
   * 无痕模式（隐私模式）下本地存储无法使用
   * 如果提供了uid，不需要本地存储支持
   * 不过可能会损失部分在线数据
   */
  stateCenter.storage = utils.isLocalStorageSupported(storage)
  if (!options.uid && !stateCenter.storage) {
    return Client.hasStorage ? 'Storage quota error' : 'Storage not support'
  }

  if (stateCenter.inited) {
    return 'Initialization ignored'
  }

  if (!options || !options.appId) {
    return 'Missing appId'
  }

  // 统一大写
  options.appId = options.appId.toUpperCase()

  // 上报质量统计，设置每隔多少个请求上报一次
  stateCenter.oss = typeof options.oss === 'number' ? options.oss : 0
  // 错误发生时捕捉错误现场
  stateCenter.getErrorScene = options.getErrorScene
  // 使用何种app打开
  stateCenter.app = options.appName || ''
  // 流量来源
  stateCenter.from = options.from || utils.getHostName(document.referrer)

  /**
   * 读取用户设置
   */
  CONST.USER_INIT_BASE_SETTINGS.split(',').forEach((i) => {
    if (options.hasOwnProperty(i)) {
      config[i] = options[i]
    }
  })
}

function settleUID(localUID) {
  /**
   * uid现在用户可以设置，所以会存在uid覆盖的情况
   * 如果覆盖则创建时间会更新
   * 更新uid不会改变是否首次激活
   */
  if (config.uid) {
    // uid小于32位的时候补齐，病毒传播的时候会校验上级节点ID
    var paddingUID = utils.padding(config.uid, CONST.PADDING_STRING, defaults.UID_MIN_LENGTH)

    // 判断补齐之后是否相等
    if (localUID !== paddingUID) {
      config.uid = paddingUID
      localUID = paddingUID
      storage.setItem(CONST.CREATE_TIME, utils.parseInt(Date.now() / 1000))
    }
  }


  var deviceID = localUID || getUID()
  innerStorage.setItem(CONST.CLIENT_KEY, deviceID)

  return deviceID
}

/**
 * 玩家退出时保存当前快照到本地
 * 下次进入时立刻上报这些数据
 */
function restoreSnapshot(isNewUser) {
  if (!stateCenter.storage)  return

  onPlayerLeave(dataCenter.saveToStorage)
  // 新玩家不必上报
  if (isNewUser) return

  request({
    url: uri.appendOnline(uri.API_PATH),
    data: dataCenter.loadFromStorage()
  }, true)
}

function initialize(options) {
  var localUID = innerStorage.getItem(CONST.CLIENT_KEY)

  // 是否首次激活
  var isAct = localUID ? 0 : 1

  var deviceId = settleUID(localUID)
  config.uid = deviceId
  config.accountId = deviceId

  if (options.errorReport) {
    onError()
  }

  // 不会随玩家切换帐号而改变
  stateCenter.initTime = utils.parseInt(Date.now() / 1000)

  /**
   * 白鹭引擎由于共享设备ID
   * 所以可能导致第一次进入游戏设备ID已经设置但是创建时间没有设置
   */
  var createTime = storage.getItem(CONST.CREATE_TIME)
  if (!createTime) {
    createTime = stateCenter.initTime
    storage.setItem(CONST.CREATE_TIME, createTime)
  }

  stateCenter.createTime = utils.parseInt(createTime)

  /**
   * 将本次PV数据写入到本地存储
   * 不管第一次PV上报是否成功，后面只要有一次上报成功数据就会准确
   */
  var pageUrl = location.href : '!'

  dataCenter.addEvent({
    eventId: CONST.EVT_PV,
    eventMap: {
      page: encodeURI(pageUrl.split('?')[0])
    }
  })

  /**
   * 激活以及父节点信息，注册在激活时暂时默认为1，目前还没有单独的注册
   * 如果不是首次激活但是有parentId也不记录节点传播关系
   */
  var regParams = isAct ? {
    actTime: createTime,
    regTime: createTime
  } : null

  // 在线（PV）上报
  onlinePolling(true, null, regParams)

  restoreSnapshot(isAct)

  // 开启在线轮询
  var minInterval = utils.isDebug ? defaults.MIN_ONLINE_INTERVAL_DEBUG : defaults.MIN_ONLINE_INTERVAL
  var interval = Math.max(minInterval, parseFloat(options.interval || minInterval)) * 1000
  onlineTimer.set(onlinePolling, interval)
  stateCenter.interval = interval
  stateCenter.inited = true
}

export default function(options) {
  if (validator.shouldNotBeDestoryed() === false) return

  var errorMSg = checkArguments(options)
  if (errorMSg) {
    return utils.tryThrow(errorMSg)
  }

  initialize(options)

  // 发送给后端的echo请求，便于接入层控制
  if (!utils.isDebug) {
    request({
      url: uri.appendEcho(Client.protocol + '//' + CONST.HOST + '/echo'),
      method: 'GET'
    }, true)
  }
}
