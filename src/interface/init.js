/**
 * SDK初始化
 */

import {document, location} from '../globals'
import * as utils from '../libs/utils.js'
import * as CONST from '../consts.js'
import * as defaults from '../defaults.js'
import * as Client from '../detect/client.js'
import stateCenter from '../utils/stateCenter.js'
import * as dataCenter from '../utils/dataCenter.js'
import * as innerStorage from '../utils/storage.js'
import storage from '../compats/storage.js'
import config from '../utils/initConfig.js'
import Timer from '../libs/timer.js'
import onlinePolling from '../utils/onlinePolling.js'
import getUID from '../compats/uid.js'

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

  // 病毒传播、错误上报默认设置为false
  config.errorReport = !!options.errorReport
  config.virus = !!options.virus
  // 上报质量统计，设置每隔多少个请求上报一次
  config.oss = typeof options.oss === 'number' ? options.oss : 0
  // 使用何种app打开
  config.app = options.appName || ''
  // 流量来源
  config.from = options.from || utils.getHostName(document.referrer)
  // 错误发生时捕捉错误现场
  config.getErrorScene = options.getErrorScene

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
  config.interval = Math.max(defaults.MIN_ONLINE_INTERVAL, parseFloat(options.interval || defaults.MIN_ONLINE_INTERVAL)) * 1000

  if (config.errorReport) {
    //injectErrorEvent()
  }

  // 在线轮询上报
  config.timer = new Timer(onlinePolling, config.interval)

  /**
   * 新版游戏初始化一次算一次启动
   * 在线时长不再使用会话存储，而是当前时间减去本次登录时间
   */
  config.loginTime = utils.parseInt(Date.now() / 1000)
  // 不会随玩家切换帐号而改变
  config.initTime = config.loginTime

  /**
   * 白鹭引擎由于共享设备ID
   * 所以可能导致第一次进入游戏设备ID已经设置但是创建时间没有设置
   */
  var createTime = storage.getItem(CONST.CREATE_TIME)
  if (!createTime) {
    createTime = config.loginTime
    storage.setItem(CONST.CREATE_TIME, createTime)
  }

  config.createTime = utils.parseInt(createTime)

  /**
   * 激活以及父节点信息，注册在激活时暂时默认为1，目前还没有单独的注册
   * 如果不是首次激活但是有parentId也不记录节点传播关系
   * TODO 激活注册信息
   */
  var regParams = isAct ? {
    actTime: createTime,
    regTime: createTime,
    parentId: config.parentId
  } : null

  /**
   * 将本次PV数据写入到本地存储
   * 不管第一次PV上报是否成功，后面只要有一次上报成功数据就会准确
   */
  var pageUrl = Client.isStandardBrowser ? location.pathname : '!'

  dataCenter.addEvent({
    eventId: CONST.EVT_PV,
    eventMap: {
      page: encodeURIComponent(pageUrl)
    }
  }, regParams)

  onlinePolling(true)

  // TODO 玩家离开

  stateCenter.inited = true
}

export default function(options) {
  var isLegal = checkArguments(options)
  if (!isLegal) {
    return false
  }

  return initialize(options)
}
