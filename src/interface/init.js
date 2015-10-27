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

/**
 * 验证用户参数
 */
function checkArguments(options) {
  /**
   * 无痕模式下属性存在但无法使用
   * TODO SDK是否无须localstorage支持
   */
  if (!utils.isLocalStorageSupported(storage)) {
    utils.log(Client.hasStorage ? 'Storage quota error' : 'Storage not support')
    return
  }

  if (stateCenter.inited) {
    utils.log('Initialization ignored')
    return
  }

  if (!options || !options.appId) {
    utils.log('Missing appId')
    return
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

  return true
}

function initDeviceID(localUID) {
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

function initialize(options) {
  var localUID = innerStorage.getItem(CONST.CLIENT_KEY)

  // 是否首次激活
  var isAct = localUID ? 0 : 1

  var deviceId = initDeviceID(localUID)
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
  var pageUrl = Client.isStandardBrowser ? location.href : '!'

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

  // 玩家退出
  onPlayerLeave(dataCenter.saveToStorage)

  // 开启在线轮询
  var interval = Math.max(defaults.MIN_ONLINE_INTERVAL, parseFloat(options.interval || defaults.MIN_ONLINE_INTERVAL)) * 1000
  onlineTimer.set(onlinePolling, interval)

  stateCenter.inited = true
  return true
}

export default function(options) {
  var isLegal = checkArguments(options)
  if (!isLegal) {
    return false
  }

  return initialize(options)
}
