var host = `rd.gdatacube.net`

export var CREATE_TIME = 'dcagent_create_time'

export var EGRET_PREFIX = 'EGRET'

export var LAYA_PREFIX = 'LAYA'

export var COCOS_PREFIX = 'COCOS'

// 未知引擎
export var UNKNOW_ENGINE = 'UE'

export var PARENT_KEY = 'dcagent_parent_id'

export var EVENTS_KEY = 'dcagent_client_events'

export var ERRORS_KEY = 'dcagent_client_errors'

export var CLIENT_KEY = 'dcagent_client_id'

export var LOGOUT_TIME = 'dc_p_lo'

export var API_PATH = `${host}/dc/hh5/sync`

export var PADDING_STRING = '0A'

export var UID_MIN_LENGTH = 32

/**
 * 自定义事件类型，上报请求耗时
 */
export var REQ_KEY = 'DE_EVENT_OSS'

// 上报超时时间
export var REQUEST_TIME_OUT = 30 * 1000

// 最大在线时长为两天
export var MAX_ONLINE_TIME = 3600 * 24 * 2

// 最短在线轮询周期，秒
export var MIN_ONLINE_INTERVAL = 40

// SDK初始化设置字段
// accountId无法在此设置，需要主动调用login接口
export var USER_INIT_BASE_SETTINGS = 'appId,appVersion,brand,channel,customDeviceId,idfa,imei,lonLat,mac,netType,operator,osVersion,platform,simCardOp,uid'

// 玩家属性，在切换用户时需要重置
export var ACCOUNT_RELATED_SETTINGS = 'accountId,accountType,age,gender,gameServer'

// 玩家角色相关属性，，在切换用户时需要重置
export var ACCOUNT_ROLE_SETTINGS = 'roleId,roleRace,roleClass,roleLevel'

export var EVT_COIN = 'DE_EVENT_COIN_ACTION'

export var EVT_ITEM = 'DE_EVENT_ITEM_ACTION'

export var EVT_LEVEL = 'DE_EVENT_LEVELUP'

export var EVT_MISSION = 'DE_EVENT_GUANKA_ACTION'

export var EVT_TASK = 'DE_EVENT_TASK_ACTION'

export var EVT_PV = 'DE_EVENT_PV'

// 尽早执行的定时器的延时
export var ASAP_TIMEOUT = 5000
