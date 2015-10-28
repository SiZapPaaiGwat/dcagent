(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : factory(global.DCAgent = {});
})(this, function (exports) {
  'use strict';

  var dataCenter = {
    get getOnlineInfo() {
      return getOnlineInfo;
    },
    get collect() {
      return collect;
    },
    get clear() {
      return clear;
    },
    get saveToStorage() {
      return saveToStorage;
    },
    get loadFromStorage() {
      return loadFromStorage;
    },
    get addError() {
      return addError;
    },
    get addEvent() {
      return addEvent;
    }
  };

  var utils = {
    get noop() {
      return noop;
    },
    get isFunction() {
      return isFunction;
    },
    get isObject() {
      return isObject;
    },
    get log() {
      return log;
    },
    get tryThrow() {
      return tryThrow;
    },
    get uuid() {
      return uuid;
    },
    get extend() {
      return extend;
    },
    get attempt() {
      return attempt;
    },
    get isLocalStorageSupported() {
      return isLocalStorageSupported;
    },
    get repeat() {
      return repeat;
    },
    get padding() {
      return padding;
    },
    get aspect() {
      return aspect;
    },
    get getHostName() {
      return getHostName;
    },
    get hiddenProperty() {
      return hiddenProperty;
    },
    get slice() {
      return slice;
    },
    get parseInt() {
      return _parseInt;
    },
    get jsonStringify() {
      return jsonStringify;
    },
    get jsonParse() {
      return jsonParse;
    }
  };

  var defaults = {
    get REQUEST_TIME_OUT() {
      return REQUEST_TIME_OUT;
    },
    get MAX_ONLINE_TIME() {
      return MAX_ONLINE_TIME;
    },
    get MIN_ONLINE_INTERVAL() {
      return MIN_ONLINE_INTERVAL;
    },
    get UID_MIN_LENGTH() {
      return UID_MIN_LENGTH;
    },
    get ASAP_TIMEOUT() {
      return ASAP_TIMEOUT;
    },
    get MAX_ERROR_COUNT() {
      return MAX_ERROR_COUNT;
    },
    get DEFAULT_AGE() {
      return DEFAULT_AGE;
    },
    get DEFAULT_GENDER() {
      return DEFAULT_GENDER;
    },
    get DEFAULT_ROLE_LEVEL() {
      return DEFAULT_ROLE_LEVEL;
    },
    get DEFAULT_NET_TYPE() {
      return DEFAULT_NET_TYPE;
    },
    get DEFAULT_PLATFORM() {
      return DEFAULT_PLATFORM;
    }
  };

  var CONST = {
    get HOST() {
      return HOST;
    },
    get CREATE_TIME() {
      return CREATE_TIME;
    },
    get EGRET_PREFIX() {
      return EGRET_PREFIX;
    },
    get LAYA_PREFIX() {
      return LAYA_PREFIX;
    },
    get COCOS_PREFIX() {
      return COCOS_PREFIX;
    },
    get UNKNOW_ENGINE() {
      return UNKNOW_ENGINE;
    },
    get PARENT_KEY() {
      return PARENT_KEY;
    },
    get EVENTS_KEY() {
      return EVENTS_KEY;
    },
    get ERRORS_KEY() {
      return ERRORS_KEY;
    },
    get CLIENT_KEY() {
      return CLIENT_KEY;
    },
    get QUIT_SNAPSHOT() {
      return QUIT_SNAPSHOT;
    },
    get LOGOUT_TIME() {
      return LOGOUT_TIME;
    },
    get API_PATH() {
      return _API_PATH;
    },
    get PADDING_STRING() {
      return PADDING_STRING;
    },
    get REQ_KEY() {
      return REQ_KEY;
    },
    get USER_INIT_BASE_SETTINGS() {
      return USER_INIT_BASE_SETTINGS;
    },
    get ACCOUNT_RELATED_SETTINGS() {
      return ACCOUNT_RELATED_SETTINGS;
    },
    get ACCOUNT_ROLE_SETTINGS() {
      return ACCOUNT_ROLE_SETTINGS;
    },
    get EVT_COIN() {
      return EVT_COIN;
    },
    get EVT_ITEM() {
      return EVT_ITEM;
    },
    get EVT_LEVEL() {
      return EVT_LEVEL;
    },
    get EVT_MISSION() {
      return EVT_MISSION;
    },
    get EVT_TASK() {
      return EVT_TASK;
    },
    get EVT_PV() {
      return EVT_PV;
    }
  };

  var onlineTimer = {
    get reset() {
      return reset;
    },
    get set() {
      return set;
    },
    get get() {
      return get;
    }
  };

  var validator = {
    get isParamsValid() {
      return isParamsValid;
    },
    get shouldBeInited() {
      return shouldBeInited;
    },
    get shouldBeLoggedIn() {
      return shouldBeLoggedIn;
    }
  };

  var Client = {
    get hasStorage() {
      return hasStorage;
    },
    get isStandardBrowser() {
      return isStandardBrowser;
    },
    get hasCookie() {
      return hasCookie;
    },
    get protocol() {
      return protocol;
    },
    get device() {
      return device;
    }
  };

  var uri = {
    get appendOnline() {
      return appendOnline;
    },
    get appendEcho() {
      return appendEcho;
    }
  };

  var API = {
    get debounce() {
      return _debounce;
    }
  };

  var innerStorage = {
    get setItem() {
      return setItem;
    },
    get getItem() {
      return getItem;
    }
  };

  var Engine = {
    get engine() {
      return engine;
    },
    get 'default'() {
      return detectEngine;
    }
  };

  // 错误信息
  var errors = [];

  /**
   * SDK内部状态管理
   */

  var stateCenter = {
    inited: false
  };

  // 当前页面使用的引擎
  var engineName;

  /**
   * SDK内部使用的顶层对象及其主要对象
   * 不同环境下区别很大
   * 比如白鹭引擎真正的顶层对象是__global，但是window也不为空
   * 所以这里要抛弃针对网页属性检测的一些传统方案
   */

  // avoid bad invocation
  /*jshint -W067*/
  // 严格模式获取顶层对象
  // http://stackoverflow.com/questions/9642491/getting-a-reference-to-the-global-object-in-an-unknown-environment-in-strict-mod
  var topThis = (1, eval)('this');

  /*jshint +W067*/

  var window = topThis || {};

  // SDK若在引擎之前加载，开始获取到的引擎名称可能为空。所以要多尝试几次
  var retryTimes = 0;

  /**
   * 获取当前引擎名称
   */
  function detectEngine() {
    if (engineName) return engineName;

    retryTimes += 1;
    if (retryTimes > 4) return;

    // egret和layabox在supports已经检测直接使用
    var engines = {
      egret: 'egret',
      layabox: 'layabox',
      // http://www.cocos2d-x.org/reference/html5-js/V3.6/index.html
      cocos: 'cc.game',
      impact: 'ig',
      phaser: 'Phaser',
      pixi: 'PIXI',
      create: 'createjs',
      three: 'THREE',
      gameMaker: 'asset_get_type',
      playCanvas: 'pc.fw',
      // http://biz.turbulenz.com/sample_assets/2dcanvas.js.html
      turbulenz: 'TurbulenzEngine',
      // http://www.html5quintus.com/#demo
      quintus: 'Quintus',
      // https://github.com/melonjs/melonJS
      melon: 'me.game',
      // https://github.com/LazerUnicorns/lycheeJS
      lychee: 'lychee',
      // http://www.clockworkchilli.com/index.php/developers/snippet/1
      wade: 'wade.addSceneObject',
      // http://craftyjs.com/
      crafty: 'Crafty',
      // https://github.com/digitalfruit/limejs
      lime: 'lime.Scene',
      // https://github.com/wise9/enchant.js
      enchant: 'enchant',
      // http://www.isogenicengine.com/docs-reference.html#IgeEngine
      isogenic: 'IgeEngine',
      // http://docs.gameclosure.com/example/advrendering-tiles/index.html
      gameclosure: 'GC.Application',
      // http://www.pandajs.net/docs/files/src_engine_scene.js.html#l11
      panda: 'game.Scene',
      // http://www.api.kiwijs.org/
      kiwi: 'Kiwi',
      // https://github.com/ippa/jaws
      jaws: 'jaws',
      // http://sirius2d.com/doc/
      sirius2d: 'ss2d',
      // http://jindo.dev.naver.com/collie/doc/index.html?l=en
      collie: 'collie',
      // https://github.com/wellcaffeinated/PhysicsJS/
      physics: 'Physics',
      // https://github.com/piqnt/stage.js
      stage: 'Stage.Anim',
      // https://github.com/BabylonJS/Babylon.js
      babylon: 'BABYLON'
    };

    for (var key in engines) {
      var namespace = engines[key];

      // 有些引擎的namespace过于通用会进行一次深度属性检测
      if (namespace.indexOf('.') > -1) {
        var props = namespace.split('.');
        var field = window[props[0]];

        if (field && field[props[1]]) {
          engineName = key;
          return key;
        }
      } else {
        if (window[namespace]) {
          engineName = key;
          return key;
        }
      }
    }
  }

  var toString = Object.prototype.toString;
  var isDebug = window.DCAGENT_DEBUG_OPEN;

  /*
   * 不做任何操作的空函数，用于各种兼容处理
   */
  function noop() {}

  function isFunction(fn) {
    return typeof fn === 'function';
  }

  // plain object, no Array, dom, function
  function isObject(value) {
    return value && toString.call(value) === '[object Object]';
  }

  function log(msg) {
    console.log('---- DCAgent log start ----\n' + msg + '\n---- DCAgent log end   ----');
  }

  /**
   * debug环境抛错，正式环境打印日志
   */
  var tryThrow = isDebug ? function (msg) {
    throw new Error(msg);
  } : function (msg) {
    log(msg);
  };

  /**
   * generate a fake UUID
   * demo on http://jsfiddle.net/briguy37/2MVFd/
   * from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
   *
   * @returns {string}
   */
  function uuid(prefix) {
    var d, formatter, uid;
    d = Date.now();
    formatter = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    uid = formatter.replace(/[xy]/g, function (c) {
      var r;
      r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      if (c === 'x') {
        return r.toString(16);
      } else {
        return (r & 0x7 | 0x8).toString(16);
      }
    });

    return (prefix || '') + uid.replace(/-/g, '').toUpperCase();
  }

  /*
   * 扩展目标对象，只支持表单post的一级扩展
   * extend({}, {a: 1}, {b: 2})
   */
  function extend(target) {
    var key, val;
    for (key in target) {
      val = target[key];
      target[key] = val;
    }

    var params = arguments.length >= 2 ? [].slice.call(arguments, 1) : [];
    params.forEach(function (param) {
      var _results;
      _results = [];
      for (key in param) {
        val = param[key];
        _results.push(target[key] = val);
      }

      return _results;
    });

    return target;
  }

  /**
   * 安全执行函数
   * debug环境需要跑出错误不能catch，否则测试通不过
   */
  var attempt = isDebug ? function (fn, context, args) {
    if (!isFunction(fn)) return;

    return fn.apply(context, args);
  } : function (fn, context, args) {
    if (!isFunction(fn)) return;

    try {
      return fn.apply(context, args);
    } catch (e) {
      log('exec error for function:\n ' + fn.toString());
    }
  };

  /**
   * 测试是否真的支持本地存储，safari无痕模式会报异常
   * http://stackoverflow.com/questions/14555347/html5-localstorage-error-with-safari-quota-exceeded-err-dom-exception-22-an
   *
   * 测试本地存储quota https://arty.name/localstorage.html
   */
  function isLocalStorageSupported(storage) {
    var key = '.';
    try {
      storage.setItem(key, key);
      storage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * 重复某个字符串N次
   */
  function repeat(str) {
    var len = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    var ret = '';
    for (var i = 0; i < len; i += 1) {
      ret += str;
    }

    return ret;
  }

  /**
   * 补齐字符串到指定最小长度
   */
  function padding(original, paddingStr, len) {
    if (!original) return original;

    if (original && original.length >= len) return original;

    return original + repeat(paddingStr, Math.ceil(len - original.length) / paddingStr.length);
  }

  /**
   * AOP切面编程功能
   * @param func 原函数
   * @param before 前置函数
   * @param after 后置函数
   * @returns {Function} 返回函数的执行结果为原函数的执行结果
   */
  function aspect(func, before, after) {
    return function () {
      if (!Array.isArray(before)) {
        before = [before];
      }

      if (!Array.isArray(after)) {
        after = [after];
      }

      var i, fn;
      for (i = 0; i < before.length; i += 1) {
        fn = before[i];
        // 前置函数返回false表示提前结束执行
        if (attempt(fn, this, arguments) === false) return;
      }

      var result = attempt(func, this, arguments);

      // 主函数返回false表示中断后置函数执行
      if (result === false) return false;

      for (i = 0; i < after.length; i += 1) {
        fn = after[i];
        attempt(fn, this, arguments);
      }

      return result;
    };
  }

  /**
   * http://stackoverflow.com/questions/736513/how-do-i-parse-a-url-into-hostname-and-path-in-javascript
   */
  function getHostName(href) {
    if (!href) return '';

    var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match ? match[3] : '';
  }

  var document = topThis.document || {};

  var hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : 'msHidden' in document ? 'msHidden' : null;

  function slice(args, start, end) {
    return [].slice.call(args, start, end);
  }

  function _parseInt(value) {
    var defaultValue = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var radix = arguments.length <= 2 || arguments[2] === undefined ? 10 : arguments[2];

    // 大于21位长度会转换为 1e21的字符串
    if (value >= 1e21) {
      value = 9527e16;
    }

    return window.parseInt(value, radix) || defaultValue;
  }

  function jsonStringify(data) {
    try {
      return data ? JSON.stringify(data) : null;
    } catch (e) {
      log('invalid json format');
    }

    return null;
  }

  function jsonParse(str) {
    try {
      return str ? JSON.parse(str) : null;
    } catch (e) {
      log('invalid json string');
    }

    return null;
  }

  exports.version = 24;

  // 上报超时时间
  var REQUEST_TIME_OUT = 30 * 1000;

  // 最大在线时长为两天
  var MAX_ONLINE_TIME = 3600 * 24 * 2;

  // 最短在线轮询周期，秒
  var MIN_ONLINE_INTERVAL = 40;

  var UID_MIN_LENGTH = 32;

  // 尽早执行的定时器的延时
  var ASAP_TIMEOUT = 5000;

  // 最大错误上报数目
  var MAX_ERROR_COUNT = 100;

  var DEFAULT_AGE = 0;

  var DEFAULT_GENDER = 0;

  var DEFAULT_ROLE_LEVEL = 0;

  var DEFAULT_NET_TYPE = 3;

  var DEFAULT_PLATFORM = 0;

  var config = {
    accountId: '',
    accountType: '',
    age: defaults.DEFAULT_AGE,
    appId: '',
    appVersion: '',
    brand: '',
    channel: '',
    customDeviceId: '',
    gameServer: '',
    gender: defaults.DEFAULT_GENDER,
    idfa: '',
    imei: '',
    lonLat: '',
    mac: '',
    netType: defaults.DEFAULT_NET_TYPE,
    operator: '',
    osVersion: '',
    platform: defaults.DEFAULT_PLATFORM,
    resolution: '',
    roleClass: '',
    roleId: '',
    roleLevel: defaults.DEFAULT_ROLE_LEVEL,
    roleRace: '',
    simCardOp: '',
    uid: '',
    ver: exports.version
  };

  // 自定义事件信息
  var events = [];

  // 已上报错误数
  var totalError = 0;

  var platform = defaults.DEFAULT_PLATFORM;

  var screenObj = window.screen || {};

  var resolution = screenObj.width && screenObj.width + '*' + screenObj.height;

  // 未知分辨率
  var unknownWH = '0*0';

  if (!resolution) {
    resolution = unknownWH;
  }

  var engine = {
    isEgret: !!window.egret,
    isLayabox: !!window.layabox,
    isCocos: !!window.cc && !!window.cc.game
  };

  var osVersion = '';

  /**
   * 如果运行环境不是浏览器
   * 需要SDK初始化时指定brand，osVersion，platform
   */
  var brand = '';

  var userAgent = window.navigator && window.navigator.userAgent || '';

  if (!userAgent) {
    var platforms = ['ios', 'android'];

    if (engine.layabox) {
      var deviceInfo = window.layabox.getDeviceInfo() || {};
      resolution = deviceInfo.resolution || unknownWH;
      brand = deviceInfo.phonemodel;
      platform = platforms.indexOf(deviceInfo.os.toLowerCase());
      osVersion = (deviceInfo.os + ' ' + deviceInfo.osversion).toLowerCase();
    } else if (engine.cocos) {
      var rect = window.cc.view.getViewPortRect() || {};
      resolution = rect.width + '*' + rect.height;
      platform = platforms.indexOf(window.cc.sys.os.toLowerCase());
      // brand和os version也无法取得
    }

    // 未知平台
    if ([0, 1, 2, 3].indexOf(platform) === -1) {
      platform = defaults.DEFAULT_PLATFORM;
    }
  }

  var device = { resolution: resolution, brand: brand, osVersion: osVersion, platform: platform };

  for (var key in device) {
    // 优先使用用户配置
    config[key] = config[key] || device[key];
  }

  function getOnlineInfo() {
    var loginTime = stateCenter.loginTime || stateCenter.initTime;
    return {
      loginTime: loginTime,
      onlineTime: utils.parseInt(Date.now() / 1000) - loginTime || 1,
      extendMap: {
        // 流量来源
        from: stateCenter.from,
        // 引擎类型
        engine: detectEngine() || '',
        // 应用名称
        app: stateCenter.app
      }
    };
  }

  /**
   * 搜集本次上报数据
   */
  function collect(payment, reg) {
    var payload = {
      headerInfo: config,
      onlineInfo: getOnlineInfo(),
      // 复制一份防止被清
      errorInfoList: errors.concat(),
      eventInfoList: events.concat()
    };

    if (payment) {
      payload.paymentInfo = payment;
    }

    if (reg) {
      payload.userInfo = reg;
    }

    return payload;
  }

  function clear() {
    events.length = 0;
    errors.length = 0;
  }

  var HOST = 'rd.gdatacube.net';

  var CREATE_TIME = 'dcagent_create_time';

  var EGRET_PREFIX = 'EGRET';

  var LAYA_PREFIX = 'LAYA';

  var COCOS_PREFIX = 'COCOS';

  // 未知引擎
  var UNKNOW_ENGINE = 'UE';

  var PARENT_KEY = 'dcagent_parent_id';

  var EVENTS_KEY = 'dcagent_client_events';

  var ERRORS_KEY = 'dcagent_client_errors';

  var CLIENT_KEY = 'dcagent_client_id';

  // 用户退出时数据存储到本地
  var QUIT_SNAPSHOT = 'dcagent_snapshot';

  var LOGOUT_TIME = 'dc_p_lo';

  var _API_PATH = '/dc/hh5/sync';

  var PADDING_STRING = '0A';

  /**
   * 自定义事件类型，上报请求耗时
   */
  var REQ_KEY = 'DE_EVENT_OSS';

  // SDK初始化设置字段
  // accountId无法在此设置，需要主动调用login接口
  var USER_INIT_BASE_SETTINGS = 'appId,appVersion,brand,channel,customDeviceId,idfa,imei,lonLat,mac,netType,operator,osVersion,platform,simCardOp,uid';

  // 玩家属性，在切换用户时需要重置
  var ACCOUNT_RELATED_SETTINGS = 'accountId,accountType,age,gender,gameServer';

  // 玩家角色相关属性，，在切换用户时需要重置
  var ACCOUNT_ROLE_SETTINGS = 'roleId,roleRace,roleClass,roleLevel';

  var EVT_COIN = 'DE_EVENT_COIN_ACTION';

  var EVT_ITEM = 'DE_EVENT_ITEM_ACTION';

  var EVT_LEVEL = 'DE_EVENT_LEVELUP';

  var EVT_MISSION = 'DE_EVENT_GUANKA_ACTION';

  var EVT_TASK = 'DE_EVENT_TASK_ACTION';

  var EVT_PV = 'DE_EVENT_PV';

  var storage;

  var hasStorage = !!window.localStorage || engine.isEgret || engine.isCocos || engine.isLayabox;

  /**
   * see egret core at src/context/localStorage/localStorage.ts
   */
  if (engine.isEgret) {
    storage = window.egret.localStorage;
  } else if (engine.isCocos) {
    storage = window.cc.sys.localStorage;
  } else {
    // layabox也是localStorage
    storage = hasStorage ? window.localStorage : {
      getItem: noop,
      setItem: noop,
      removeItem: noop
    };
  }

  var D__git_dcagent_src_compats_storage = storage;

  /**
   * 用户退出时将当前数据保存到本地存储
   */
  function saveToStorage() {
    D__git_dcagent_src_compats_storage.setItem(CONST.LOGOUT_TIME, utils.parseInt(Date.now() / 1000));

    if (errors.length || events.length) {
      D__git_dcagent_src_compats_storage.setItem(CONST.QUIT_SNAPSHOT, utils.jsonStringify(collect()));
    }
  }

  /**
   * 用户进入时从本地存储导入数据
   */
  function loadFromStorage() {
    return utils.jsonParse(D__git_dcagent_src_compats_storage.getItem(CONST.QUIT_SNAPSHOT));
  }

  function addError(item) {
    if (totalError >= defaults.MAX_ERROR_COUNT) return;

    errors.push(item);

    totalError += 1;
  }

  function addEvent(item) {
    events.push(item);
  }

  function onEvent(eventId, json) {
    if (!eventId) {
      utils.tryThrow("Missing eventId");
      return false;
    }

    // 兼容v1的三个参数的情况
    if (arguments.length > 2) {
      json = arguments[2];
    }

    var jsonStr = {};
    if (utils.isObject(json)) {
      for (var key in json) {
        // 没有编码，移除%
        jsonStr[key.replace('%', '_')] = typeof json[key] === 'number' ? json[key] : encodeURIComponent(json[key]);
      }
    }

    dataCenter.addEvent({
      eventId: eventId,
      eventMap: jsonStr
    });

    return true;
  }

  function getUid() {
    return config.uid || '';
  }

  var timer;

  var setTimeout = window.setTimeout;
  var clearTimeout = window.clearTimeout;

  /**
   * egret 参数略有不同
   */
  if (engine.isEgret) {
    setTimeout = function (func, time) {
      window.egret.setTimeout(func, window, time);
    };

    clearTimeout = function (id) {
      window.egret.clearTimeout(id);
    };
  }

  function Timer(fn, duration) {
    var _this = this;

    /**
     * running期间多次调用会执行多次
     * 下个执行点为轮询执行完毕的duration之后
     */
    this.duration = duration;
    this.status = 'running';
    this.timer = setTimeout(function () {
      return _this.run();
    }, this.duration);

    // 立即执行一次函数
    this.run = function () {
      // 清除上次的定时器
      clearTimeout(_this.timer);

      utils.attempt(fn);

      _this.timer = setTimeout(function () {
        return _this.run();
      }, _this.duration);
    };

    this.stop = function () {
      _this.status = 'stopped';
      clearTimeout(_this.timer);
    };

    // reset之后也会立即执行一次
    this.reset = function (num) {
      _this.stop();
      if (num) {
        _this.duration = num;
      }
      _this.run();
    };
  }

  /**
   * 等待一个周期再启动Timer
   */
  function reset(interval) {
    if (timer) {
      timer.stop();
      setTimeout(function () {
        timer.reset(interval);
      }, interval);
    }
  }

  function set(func, interval) {
    timer = new Timer(func, interval);
  }

  function get() {
    return timer;
  }

  var failedCount = 0;

  /**
   * for Egret Runtime and Native
   */
  function egretRequest(opts) {
    var egret = window.egret;
    var loader = new egret.URLLoader();
    var start = Date.now();

    loader.addEventListener(egret.Event.COMPLETE, function onNativeRequestComplete(e) {
      var elapsed = Date.now() - start;
      var context = e.target;
      var isValid = context.data === 'success';

      utils.attempt(isValid ? opts.success : opts.error, context, [context, elapsed, elapsed >= opts.timeout]);
      utils.attempt(opts.complete, context, [context, elapsed]);
      // TODO 白鹭这里能够获取headers吗？
    });

    var request = new egret.URLRequest(opts.url);
    request.method = opts.method || egret.URLRequestMethod.POST;
    request.data = utils.jsonStringify(opts.data);
    loader.load(request);
  }

  function createBrowserXHR() {
    return new window.XMLHttpRequest();
  }

  /**
   * for standard browser and layabox, or cocos
   */
  function createCocosXHR() {
    return window.cc.loader.getXMLHttpRequest();
  }

  var createXHR = engine.isCocos ? createCocosXHR : createBrowserXHR;

  function _request(opts) {
    var xhr = createXHR();
    /**
     * 切断网络或者手机切到后台可能导致timeout
     */
    xhr.timeout = opts.timeout;
    xhr.open(opts.method || 'POST', opts.url, true);
    xhr.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');

    var start = Date.now();

    xhr.onreadystatechange = function () {
      if (this.readyState !== 4) return;

      var isValid = this.status >= 200 && this.status < 300;
      var elapsed = Date.now() - start;

      utils.attempt(isValid ? opts.success : opts.error, this, [this, elapsed]);
      utils.attempt(opts.complete, this, [this, elapsed]);

      this.onreadystatechange = null;
      this.ontimeout = null;
    };

    xhr.ontimeout = function () {
      var elapsed = Date.now() - start;

      utils.attempt(opts.error, this, [this, elapsed, true]);
      utils.attempt(opts.complete, this, [this, elapsed]);

      this.onreadystatechange = null;
      this.ontimeout = null;
    };

    xhr.send(utils.jsonStringify(opts.data));
  }

  var ajax = (function () {
    // for browser layabox cocos
    if (window.XMLHttpRequest || engine.isCocos) return _request;

    if (engine.isEgret) return egretRequest;

    utils.log('XMLHttpRequest not found');
    return utils.noop;
  })();

  var reportCount = 0;

  // 上次请求发生时间
  var lastRequestTime = 0;

  function request(opts, force) {
    var now = Date.now();

    /**
     * 频率控制
     * 强制上报的请求不受限制
     */
    if (!force) {
      if (lastRequestTime && now - lastRequestTime < defaults.ASAP_TIMEOUT) {
        utils.tryThrow('Request dropped: unexpected behavior');
        return;
      }

      lastRequestTime = now;
    }

    reportCount += 1;

    ajax({
      url: opts.url,
      data: opts.data,
      success: function (xhr, elapsed) {
        utils.attempt(opts.success, xhr, [xhr, elapsed]);
      },
      error: function (xhr, elapsed, isTimeout) {
        failedCount += 1;
        utils.attempt(opts.error, xhr, [xhr, elapsed, isTimeout]);
      },
      complete: function (xhr, elapsed) {
        utils.attempt(opts.complete, xhr, [xhr, elapsed]);

        /**
         * 重新设置定时器
         */
        if (!xhr.getAllResponseHeaders || !xhr.getResponseHeader) return;

        var headers = xhr.getAllResponseHeaders();
        var header = 'X-Rate-Limit';
        if (headers.indexOf(header) === -1) return;

        var interval = utils.parseInt(xhr.getResponseHeader(header));
        if (interval > 1) {
          onlineTimer.reset(interval * 1000);
        }
      }
    });
  }

  /**
   * 验证上报参数是否合法
   */
  function isParamsValid(data) {
    if (!data) return false;

    var onlineTime = data.onlineInfo.onlineTime;
    if (onlineTime < 1 || onlineTime > defaults.MAX_ONLINE_TIME) {
      utils.tryThrow('Illegal online time');
      return false;
    }

    return true;
  }

  function shouldBeInited() {
    if (!stateCenter.inited) {
      utils.tryThrow('DCAgent.init needed');
      return false;
    }
  }

  function shouldBeLoggedIn() {
    if (!stateCenter.loginTime) {
      utils.tryThrow('DCAgent.login needed');
      return false;
    }
  }

  function hasDOM() {

    if (document && isFunction(document.createElement)) {
      /**
       * document.createElement is not reliable
       * since there is some kind browser you can just create canvas only
       */
      var node = document.createElement('div');

      /**
       * node may be an empty object or null (layabox earlier version)
       */
      if (!node) return false;

      /**
       * detect logic, create dom and exec query
       */
      if (isFunction(node.querySelector)) {
        node.innerHTML = '<i></i>';

        var el = node.querySelector('i');

        return !!el && el.tagName === 'I';
      }

      /**
       * for old browsers such as IE version < 9
       */
      if (isFunction(node.getElementsByTagName)) {
        var children = node.getElementsByTagName('i');

        return !!children && children.length === 1;
      }
    }

    return false;
  }

  var isStandardBrowser = hasDOM();
  var hasCookie = isStandardBrowser && 'cookie' in document;

  var location = topThis.location || {};

  var protocol = location.protocol === 'https:' ? 'https:' : 'http:';

  var API_PATH = Client.protocol + '//' + CONST.HOST + CONST.API_PATH;

  // TODO 上报请求
  function appendOnline(uri) {
    return uri + '?__deuid=' + config.uid + '&__deappid=' + config.appId;
  }

  function appendEcho(uri) {
    return uri + '?type=h520&appId=' + config.appId + '&uid=' + config.uid + '&mac=' + (config.mac || '') + '&imei=' + (config.imei || '') + '&idfa=' + (config.idfa || '');
  }

  function onlinePolling(force, payment, reg) {
    // 如果文档被隐藏暂时不上报
    if (!force && utils.hiddenProperty && document[utils.hiddenProperty]) return;

    var opts = {
      url: uri.appendOnline(API_PATH)
    };

    /**
     * 上报质量统计，每隔多少个周期上报，默认为10
     */
    if (reportCount && reportCount % stateCenter.oss === 0) {
      dataCenter.addEvent({
        eventId: CONST.REQ_KEY,
        eventMap: {
          succ: reportCount - failedCount,
          fail: failedCount,
          total: reportCount
        }
      });
    }

    opts.data = dataCenter.collect(payment, reg);

    if (!validator.isParamsValid(opts.data)) return;

    dataCenter.clear();

    /**
     * 如果上传失败将本次数据回写
     */
    var errors = opts.data.errorInfoList;
    var events = opts.data.eventInfoList;
    if (events.length || errors.length) {
      opts.error = function () {
        errors.forEach(function (item) {
          dataCenter.addError(item);
        });

        events.forEach(function (item) {
          dataCenter.addEvent(item);
        });
      };
    }

    request(opts, force);
  }

  /**
   * 连续多次调用login会切换帐户
   * 由于login存在异步请求，所以依赖于login的接口需要判断loginStatus
   */
  function login(accountID) {
    if (!accountID) {
      utils.tryThrow('Missing accountID');
      return;
    }

    stateCenter.loginTime = utils.parseInt(Date.now() / 1000);

    // 重新设置不会起作用
    if (config.accountId === accountID) {
      return;
    }

    var timer = onlineTimer.get();
    timer.stop();

    // 上报上个用户的所有数据
    onlinePolling(true);

    // 清除上次用户设置
    var accountBaseSettings = CONST.ACCOUNT_RELATED_SETTINGS + ',' + CONST.ACCOUNT_ROLE_SETTINGS;
    accountBaseSettings.split(',').forEach(function (x) {
      return config[x] = '';
    });

    // 以下设置需设置为默认值
    config.age = defaults.DEFAULT_AGE;
    config.gender = defaults.DEFAULT_GENDER;
    config.roleLevel = defaults.DEFAULT_ROLE_LEVEL;
    config.accountId = accountID;

    // 立即执行一次在线上报
    timer.reset();
  }

  var initBasedAPI = {
    login: login,
    getUid: getUid,
    onEvent: onEvent
  };

  var controlTimeoutID;

  /**
   * 优化接口调用的数据上报
   * 使其尽可能快地批量上报数据
   */
  function _debounce() {
    console.log('debounce');
    clearTimeout(controlTimeoutID);

    var timer = onlineTimer.get();
    timer.stop();

    controlTimeoutID = setTimeout(function () {
      timer.run();
    }, defaults.ASAP_TIMEOUT);
  }

  /**
   * 设置角色信息
   * 如果角色已经创建则每次都要设置角色信息
   * 参数依次为id, race, class, level
   */
  function setRoleInfo(roleID, roleRace, roleClass, roleLevel) {
    var _arguments = arguments;

    CONST.ACCOUNT_ROLE_SETTINGS.split(',').forEach(function (x, i) {
      return config[x] = _arguments[i] || '';
    });

    config.roleLevel = utils.parseInt(roleLevel) || 1;
  }

  /**
   * 创建角色
   * 参数依次为id, race, class, level
   */
  function createRole(roleID, roleRace, roleClass, roleLevel) {
    setRoleInfo(roleID, roleRace, roleClass, roleLevel);

    onEvent('DE_EVENT_CREATE_ROLE', {
      roleId: String(roleID),
      roleRace: String(roleRace),
      roleClass: String(roleClass)
    });
  }

  /**
   * @param gender {Number} 2为女性，1位男性
   */
  function setGender(gender) {
    config.gender = gender === 2 ? 2 : 1;
  }

  function setGameServer() {
    var serverID = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    config.gameServer = String(serverID);
  }

  /**
   * @param age {Number} 1~128
   */
  function setAge(age) {
    age = utils.parseInt(age);
    config.age = age > 0 && age < 128 ? age : 0;
  }

  function setAccountType() {
    var typeID = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

    config.accountType = String(typeID);
  }

  function onTaskUnfinished(taskID, elapsed) {
    onEvent(CONST.EVT_TASK, {
      actionType: 'taskUnfinish',
      taskId: taskID,
      elapsed: utils.parseInt(elapsed)
    });
  }

  function onTaskFinished(taskID, elapsed) {
    onEvent(CONST.EVT_TASK, {
      actionType: 'taskFinish',
      taskId: taskID,
      elapsed: utils.parseInt(elapsed)
    });
  }

  function onPayment(opts) {
    if (!opts || !opts.hasOwnProperty('amount')) {
      return;
    }

    onlinePolling(true, {
      currencyAmount: parseFloat(opts.amount, 10) || 0,
      currencyType: opts.currencyType || 'CNY',
      payType: String(opts.payType || ''),
      iapid: String(opts.iapid || ''),
      payTime: utils.parseInt(Date.now() / 1000),
      extendMap: {
        orderId: String(opts.orderId || '')
      }
    });
  }

  function onMissionUnfinished(taskID, elapsed) {
    onEvent(CONST.EVT_MISSION, {
      actionType: 'guankaUnfinish',
      guankaId: taskID,
      duration: utils.parseInt(elapsed)
    });
  }

  function onMissionFinished(taskID, elapsed) {
    onEvent(CONST.EVT_MISSION, {
      actionType: 'guankaFinish',
      guankaId: taskID,
      duration: utils.parseInt(elapsed)
    });
  }

  /**
   * 记录升级耗时
   * @param startLevel
   * @param endLevel
   * @param elapsed
   */
  function onLevelUp(startLevel, endLevel, elapsed) {
    endLevel = utils.parseInt(endLevel);
    config.roleLevel = endLevel;

    onEvent(CONST.EVT_LEVEL, {
      startLevel: utils.parseInt(startLevel),
      endLevel: endLevel,
      duration: utils.parseInt(elapsed)
    });
  }

  /**
   * 记录关卡内道具消耗以及原因
   * @param itemID
   * @param itemNum
   * @param reason
   * @param missionId
   */
  function onItemUse(itemID, itemNum, missionID, reason) {
    onEvent(CONST.EVT_ITEM, {
      actionType: 'itemUse',
      itemId: itemID,
      itemNum: utils.parseInt(itemNum),
      reason: reason,
      missonID: missionID
    });
  }

  /**
   * 记录关卡内道具产出以及原因
   * @param itemID
   * @param itemNum
   * @param missionID 关卡ID
   * @param reason
   */
  function onItemProduce(itemID, itemNum, missionID, reason) {
    onEvent(CONST.EVT_ITEM, {
      actionType: 'itemGet',
      itemId: itemID,
      itemNum: utils.parseInt(itemNum),
      missonID: missionID,
      reason: reason
    });
  }

  /**
   * 记录关卡内使用虚拟币购买道具
   * @param itemID
   * @param itemNum
   * @param coinType
   * @param coinNum
   * @param missionID
   */
  function onItemBuy(itemID, itemNum, coinType, coinNum, missionID) {
    onEvent(CONST.EVT_ITEM, {
      actionType: 'itemBuy',
      itemId: itemID,
      itemNum: utils.parseInt(itemNum),
      coinType: coinType,
      coinNum: utils.parseInt(coinNum),
      missonID: missionID
    });
  }

  /**
   * 消耗虚拟币，设置留存总量
   * @param gainNum 消耗数量
   * @param balanceNum 留存总量
   * @param coinType 虚拟币类型
   * @param reason 原因
   */
  function onCoinUse(gainNum, balanceNum, coinType, reason) {
    onEvent(CONST.EVT_COIN, {
      actionType: 'coinUse',
      coinType: coinType,
      balanceNum: utils.parseInt(balanceNum),
      coinNum: utils.parseInt(gainNum),
      reason: reason
    });
  }

  /**
   * 获取虚拟币，设置留存总量
   * @param gainNum 获取数量
   * @param balanceNum 留存总量
   * @param coinType 虚拟币类型
   * @param reason 原因
   */
  function onCoinGet(gainNum, balanceNum, coinType, reason) {
    onEvent(CONST.EVT_COIN, {
      actionType: 'coinGet',
      coinType: coinType,
      balanceNum: utils.parseInt(balanceNum),
      coinNum: utils.parseInt(gainNum),
      reason: reason
    });
  }

  var loginBasedAPI = {
    onCoinGet: onCoinGet,
    onCoinUse: onCoinUse,
    onItemBuy: onItemBuy,
    onItemProduce: onItemProduce,
    onItemUse: onItemUse,
    onLevelUp: onLevelUp,
    onMissionFinished: onMissionFinished,
    onMissionUnfinished: onMissionUnfinished,
    onPayment: onPayment,
    onTaskFinished: onTaskFinished,
    onTaskUnfinished: onTaskUnfinished,
    setAccountType: setAccountType,
    setAge: setAge,
    setGameServer: setGameServer,
    setGender: setGender,
    setRoleInfo: setRoleInfo,
    createRole: createRole
  };

  var name;
  var preInit = [validator.shouldBeInited];
  var preLogin = [validator.shouldBeLoggedIn];
  var debounce = [API.debounce];

  /**
   * 校验是否已经初始化
   * onEvent需要debounce
   */
  for (name in initBasedAPI) {
    exports[name] = utils.aspect(initBasedAPI[name], preInit, name === 'onEvent' && debounce);
  }

  /**
   * 校验是否已登录
   * onPayment是立即调用
   * 此处的接口使用内置的onEvent函数
   */
  for (name in loginBasedAPI) {
    exports[name] = utils.aspect(loginBasedAPI[name], preLogin, name !== 'onPayment' && debounce);
  }

  /**
   * 执行快速统计调用
   * dc('init', {...})
   * dc(onEvent, id, data)
   */
  var proxyName = window.DCAgentObject;
  if (proxyName) {
    var proxy = window[proxyName];
    if (utils.isFunction(proxy)) {
      var cache = proxy.cache;

      if (cache.length) {
        cache.forEach(function (args) {
          utils.attempt(exports[args[0]], exports, utils.slice(args, 1));
        });

        cache.length = 0;
      }
    }
  }

  function isReady() {
    return stateCenter.inited;
  }

  var player = {
    get isNew() {
      var loginTime = stateCenter.loginTime || stateCenter.initTime;
      return stateCenter.createTime === loginTime;
    },
    get initTime() {
      return stateCenter.initTime;
    },
    get createTime() {
      return stateCenter.createTime;
    },
    get loginTime() {
      return stateCenter.loginTime;
    },
    get lastLogoutTime() {
      return parseInt(D__git_dcagent_src_compats_storage.getItem(CONST.LOGOUT_TIME));
    },
    get getReportCount() {
      return reportCount;
    },
    get getReportFailedCount() {
      return failedCount;
    }
  };

  function getLeavingEvent() {
    var props = ['pagehide', 'beforeunload', 'unload'];
    for (var i = 0; i < props.length; i += 1) {
      if ('on' + props[i] in window) return props[i];
    }
  }

  function onPlayerLeave(cb) {
    if (window.addEventListener) {
      var eventName = getLeavingEvent();
      if (eventName) {
        window.addEventListener(eventName, cb);
      }
    }
  }

  function onError() {
    window.addEventListener && window.addEventListener('error', function (e) {
      utils.attempt(function () {

        var params = {};
        var keys = ['colno', 'filename', 'lineno', 'message'];
        keys.forEach(function (i) {
          return params[i] = e[i] || '1';
        });

        var error = e.error || {};
        params.stack = encodeURIComponent(error.stack || error.stacktrace || '');
        params.type = error.name || 'Error';
        params.timestamp = parseInt(e.timeStamp / 1000);

        // 支持在错误发生时由用户自定义信息搜集
        if (utils.isFunction(stateCenter.getErrorScene)) {
          var customMsg = utils.attempt(stateCenter.getErrorScene, error, [e]);
          if (customMsg) {
            // 如果是对象按行转换成a=b
            if (utils.isObject(customMsg)) {
              var details = '';
              for (var key in customMsg) {
                details += '\t' + key + '=' + customMsg[key] + '\n';
              }

              customMsg = details;
            } else {
              customMsg = String(customMsg);
            }

            params.stack += '\n\nError scene:\n' + encodeURIComponent(customMsg);
          }
        }

        dataCenter.addError(params);
      });
    }, false);
  }

  var Cookie = {
    get: function (name) {
      var reg = '(^|)\\s*' + name + '=([^\\s]*)';
      var c = document.cookie.match(new RegExp(reg));

      return c && c.length >= 3 ? decodeURIComponent(c[2]) : null;
    },
    set: function (name, value, days, domain, path, secure) {
      var d;
      if (days) {
        d = new Date();
        d.setTime(d.getTime() + days * 8.64e7);
      }
      var expiresStr = days ? ' expires=' + d.toGMTString() : '';
      var pathStr = ' path=' + (path || '/');
      var domainStr = domain ? ' domain=' + domain : '';
      var secureStr = secure ? ' secure' : '';
      document.cookie = name + '=' + encodeURIComponent(value) + expiresStr + pathStr + domainStr + secureStr;
    },
    remove: function (name, domain, path) {
      Cookie.set(name, '', -1, domain, path);
    }
  };

  var cookie = Client.hasCookie ? Cookie : {
    get: utils.noop,
    set: utils.noop
  };

  var _Cookie = cookie;

  function wrapKey(key) {
    // 设备ID不加APPID前缀，方便跨app定位用户
    if (Client.isStandardBrowser || CONST.CLIENT_KEY === key) {
      return key;
    }

    // egret的localStorage是跨APP共享的，所以需要自己完成数据隔离
    return config.appId + '.' + key;
  }

  function setItem(key, value) {
    key = wrapKey(key);
    D__git_dcagent_src_compats_storage.setItem(key, value);
    _Cookie.set(key, value, 3650);
  }

  function getItem(key) {
    key = wrapKey(key);
    return D__git_dcagent_src_compats_storage.getItem(key) || _Cookie.get(key);
  }

  /**
   * 不同的引擎获取不同的前缀
   */
  function getPrefix() {
    var timestamp = Date.now().toString(36).toUpperCase();
    var engine = Engine.engine;

    // 八位长度的36进制客户端时间戳
    if (engine.egret) {
      return CONST.EGRET_PREFIX + timestamp;
    }

    if (engine.layabox) {
      return CONST.LAYA_PREFIX + timestamp;
    }

    if (engine.cocos) {
      return CONST.COCOS_PREFIX + timestamp;
    }

    return CONST.UNKNOW_ENGINE + timestamp;
  }

  function Fingerprint(options) {
    var nativeForEach, nativeMap;
    nativeForEach = Array.prototype.forEach;
    nativeMap = Array.prototype.map;

    this.each = function (obj, iterator, context) {
      if (obj === null) {
        return;
      }
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (iterator.call(context, obj[i], i, obj) === {}) return;
        }
      } else {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (iterator.call(context, obj[key], key, obj) === {}) return;
          }
        }
      }
    };

    this.map = function (obj, iterator, context) {
      var results = [];
      // Not using strict equality so that this acts as a
      // shortcut to checking for `null` and `undefined`.
      if (obj == null) return results;
      if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
      this.each(obj, function (value, index, list) {
        results[results.length] = iterator.call(context, value, index, list);
      });
      return results;
    };

    if (typeof options === 'object') {
      this.hasher = options.hasher;
      this.screen_resolution = options.screen_resolution;
      this.screen_orientation = options.screen_orientation;
      this.canvas = options.canvas;
      this.ie_activex = options.ie_activex;
    } else if (typeof options === 'function') {
      this.hasher = options;
    }
  }

  var navigator = window.navigator;

  Fingerprint.prototype.isIE = function () {
    if (navigator.appName === 'Microsoft Internet Explorer') {
      return true;
    } else if (navigator.appName === 'Netscape' && /Trident/.test(navigator.userAgent)) {
      // IE 11
      return true;
    }
    return false;
  };

  Fingerprint.prototype.getRegularPluginsString = function () {
    return this.map(navigator.plugins, function (p) {
      var mimeTypes = this.map(p, function (mt) {
        return [mt.type, mt.suffixes].join('~');
      }).join(',');
      return [p.name, p.description, mimeTypes].join('::');
    }, this).join(';');
  };

  var screen = window.screen;

  Fingerprint.prototype.get = function () {
    var keys = [];
    keys.push(navigator.userAgent);
    keys.push(navigator.language);
    keys.push(screen.colorDepth);
    if (this.screen_resolution) {
      var resolution = this.getScreenResolution();
      if (typeof resolution !== 'undefined') {
        // headless browsers, such as phantomjs
        keys.push(resolution.join('x'));
      }
    }
    keys.push(new Date().getTimezoneOffset());
    keys.push(this.hasSessionStorage());
    keys.push(this.hasLocalStorage());
    keys.push(!!window.indexedDB);
    //body might not be defined at this point or removed programmatically
    if (document.body) {
      keys.push(typeof document.body.addBehavior);
    } else {
      keys.push(typeof undefined);
    }
    keys.push(typeof window.openDatabase);
    keys.push(navigator.cpuClass);
    keys.push(navigator.platform);
    keys.push(navigator.doNotTrack);
    keys.push(this.getPluginsString());
    if (this.canvas && this.isCanvasSupported()) {
      keys.push(this.getCanvasFingerprint());
    }
    if (this.hasher) {
      return this.hasher(keys.join('###'), 31);
    } else {
      return this.murmurhash3_32_gc(keys.join('###'), 31);
    }
  };

  /**
   * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011)
   *
   * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
   * @see http://github.com/garycourt/murmurhash-js
   * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
   * @see http://sites.google.com/site/murmurhash/
   *
   * @param {string} key ASCII only
   * @param {number} seed Positive integer only
   * @return {number} 32-bit positive integer hash
   */

  Fingerprint.prototype.murmurhash3_32_gc = function (key, seed) {
    var remainder, bytes, h1, h1b, c1, c2, k1, i;

    remainder = key.length & 3; // key.length % 4
    bytes = key.length - remainder;
    h1 = seed;
    c1 = 0xcc9e2d51;
    c2 = 0x1b873593;
    i = 0;

    while (i < bytes) {
      k1 = key.charCodeAt(i) & 0xff | (key.charCodeAt(++i) & 0xff) << 8 | (key.charCodeAt(++i) & 0xff) << 16 | (key.charCodeAt(++i) & 0xff) << 24;
      ++i;

      k1 = (k1 & 0xffff) * c1 + (((k1 >>> 16) * c1 & 0xffff) << 16) & 0xffffffff;
      k1 = k1 << 15 | k1 >>> 17;
      k1 = (k1 & 0xffff) * c2 + (((k1 >>> 16) * c2 & 0xffff) << 16) & 0xffffffff;

      h1 ^= k1;
      h1 = h1 << 13 | h1 >>> 19;
      h1b = (h1 & 0xffff) * 5 + (((h1 >>> 16) * 5 & 0xffff) << 16) & 0xffffffff;
      h1 = (h1b & 0xffff) + 0x6b64 + (((h1b >>> 16) + 0xe654 & 0xffff) << 16);
    }

    k1 = 0;

    switch (remainder) {
      case 3:
        k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
        break;
      case 2:
        k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
        break;
      case 1:
        k1 ^= key.charCodeAt(i) & 0xff;

        k1 = (k1 & 0xffff) * c1 + (((k1 >>> 16) * c1 & 0xffff) << 16) & 0xffffffff;
        k1 = k1 << 15 | k1 >>> 17;
        k1 = (k1 & 0xffff) * c2 + (((k1 >>> 16) * c2 & 0xffff) << 16) & 0xffffffff;
        h1 ^= k1;
    }

    h1 ^= key.length;

    h1 ^= h1 >>> 16;
    h1 = (h1 & 0xffff) * 0x85ebca6b + (((h1 >>> 16) * 0x85ebca6b & 0xffff) << 16) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = (h1 & 0xffff) * 0xc2b2ae35 + (((h1 >>> 16) * 0xc2b2ae35 & 0xffff) << 16) & 0xffffffff;
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
  };

  // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
  Fingerprint.prototype.hasLocalStorage = function () {
    try {
      return !!window.localStorage;
    } catch (e) {
      return true; // SecurityError when referencing it means it exists
    }
  };

  Fingerprint.prototype.hasSessionStorage = function () {
    try {
      return !!window.sessionStorage;
    } catch (e) {
      return true; // SecurityError when referencing it means it exists
    }
  };

  Fingerprint.prototype.isCanvasSupported = function () {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  };

  Fingerprint.prototype.getPluginsString = function () {
    if (this.isIE() && this.ie_activex) {
      return this.getIEPluginsString();
    } else {
      return this.getRegularPluginsString();
    }
  };

  Fingerprint.prototype.getIEPluginsString = function () {
    if (window.ActiveXObject) {
      var names = ['ShockwaveFlash.ShockwaveFlash', //flash plugin
      'AcroPDF.PDF', // Adobe PDF reader 7+
      'PDF.PdfCtrl', // Adobe PDF reader 6 and earlier, brrr
      'QuickTime.QuickTime', // QuickTime
      // 5 versions of real players
      'rmocx.RealPlayer G2 Control', 'rmocx.RealPlayer G2 Control.1', 'RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)', 'RealVideo.RealVideo(tm) ActiveX Control (32-bit)', 'RealPlayer', 'SWCtl.SWCtl', // ShockWave player
      'WMPlayer.OCX', // Windows media player
      'AgControl.AgControl', // Silverlight
      'Skype.Detection'];

      // starting to detect plugins in IE
      return this.map(names, function (name) {
        try {
          new window.ActiveXObject(name);
          return name;
        } catch (e) {
          return null;
        }
      }).join(';');
    } else {
      return ""; // behavior prior version 0.5.0, not breaking backwards compat.
    }
  };

  Fingerprint.prototype.getScreenResolution = function () {
    var resolution;
    if (this.screen_orientation) {
      resolution = screen.height > screen.width ? [screen.height, screen.width] : [screen.width, screen.height];
    } else {
      resolution = [screen.height, screen.width];
    }
    return resolution;
  };

  Fingerprint.prototype.getCanvasFingerprint = function () {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    // https://www.browserleaks.com/canvas#how-does-it-work
    var txt = 'http://www.dataeye.com/';
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText(txt, 4, 17);
    return canvas.toDataURL();
  };

  var FingerPrint = Fingerprint;

  /**
   * 生成唯一的设备ID
   * 只在使用uuid的时候附加前缀，其他情况不附加
   * layabox返回结果
   * {
   *  	resolution:1440*900,
   *  	mac:xxxxx,
   *  	imei:[xxxxx,x],
   *  	imsi:[xx,xx],
   *  	os:android,
   *  	osversion:4.4
   *  	phonemodel:HTC
   *  	idfa:xxxx,
   * }
   */
  function getUID() {
    var uid;

    try {
      if (Client.isStandardBrowser) {
        uid = new FingerPrint({ canvas: true, screen_resolution: true, ie_activex: true }).get().toString();
      } else {
        if (Engine.engine.layabox) {
          var deviceInfo = window.layabox.getDeviceInfo() || {};
          uid = deviceInfo.mac || deviceInfo.idfa;
          uid = uid && uid.replace(/[-_:=\s]+/g, '').toUpperCase();
        }
      }
    } catch (e) {
      uid = null;
    }

    // 不足uid最小长度则补齐
    uid = utils.padding(uid, CONST.PADDING_STRING, defaults.UID_MIN_LENGTH);

    return uid || utils.uuid(getPrefix());
  }

  function initDeviceID(localUID) {
    /**
     * uid现在用户可以设置，所以会存在uid覆盖的情况
     * 如果覆盖则创建时间会更新
     * 更新uid不会改变是否首次激活
     */
    if (config.uid) {
      // uid小于32位的时候补齐，病毒传播的时候会校验上级节点ID
      var paddingUID = utils.padding(config.uid, CONST.PADDING_STRING, defaults.UID_MIN_LENGTH);

      // 判断补齐之后是否相等
      if (localUID !== paddingUID) {
        config.uid = paddingUID;
        localUID = paddingUID;
        D__git_dcagent_src_compats_storage.setItem(CONST.CREATE_TIME, utils.parseInt(Date.now() / 1000));
      }
    }

    var deviceID = localUID || getUID();
    innerStorage.setItem(CONST.CLIENT_KEY, deviceID);

    return deviceID;
  }

  function initialize(options) {
    var localUID = innerStorage.getItem(CONST.CLIENT_KEY);

    // 是否首次激活
    var isAct = localUID ? 0 : 1;

    var deviceId = initDeviceID(localUID);
    config.uid = deviceId;
    config.accountId = deviceId;

    if (options.errorReport) {
      onError();
    }

    // 不会随玩家切换帐号而改变
    stateCenter.initTime = utils.parseInt(Date.now() / 1000);

    /**
     * 白鹭引擎由于共享设备ID
     * 所以可能导致第一次进入游戏设备ID已经设置但是创建时间没有设置
     */
    var createTime = D__git_dcagent_src_compats_storage.getItem(CONST.CREATE_TIME);
    if (!createTime) {
      createTime = stateCenter.initTime;
      D__git_dcagent_src_compats_storage.setItem(CONST.CREATE_TIME, createTime);
    }

    stateCenter.createTime = utils.parseInt(createTime);

    /**
     * 将本次PV数据写入到本地存储
     * 不管第一次PV上报是否成功，后面只要有一次上报成功数据就会准确
     */
    var pageUrl = Client.isStandardBrowser ? location.href : '!';

    dataCenter.addEvent({
      eventId: CONST.EVT_PV,
      eventMap: {
        page: encodeURI(pageUrl.split('?')[0])
      }
    });

    /**
     * 激活以及父节点信息，注册在激活时暂时默认为1，目前还没有单独的注册
     * 如果不是首次激活但是有parentId也不记录节点传播关系
     */
    var regParams = isAct ? {
      actTime: createTime,
      regTime: createTime
    } : null;

    // 在线（PV）上报
    onlinePolling(true, null, regParams);

    // 玩家退出
    onPlayerLeave(dataCenter.saveToStorage);

    // 开启在线轮询
    var interval = Math.max(defaults.MIN_ONLINE_INTERVAL, parseFloat(options.interval || defaults.MIN_ONLINE_INTERVAL)) * 1000;
    onlineTimer.set(onlinePolling, interval);

    stateCenter.inited = true;
  }

  /**
   * 验证用户参数
   */
  function checkArguments(options) {
    /**
     * 无痕模式下属性存在但无法使用
     * TODO SDK是否无须localstorage支持
     */
    if (!utils.isLocalStorageSupported(D__git_dcagent_src_compats_storage)) {
      return Client.hasStorage ? 'Storage quota error' : 'Storage not support';
    }

    if (stateCenter.inited) {
      return 'Initialization ignored';
    }

    if (!options || !options.appId) {
      return 'Missing appId';
    }

    // 统一大写
    options.appId = options.appId.toUpperCase();

    // 上报质量统计，设置每隔多少个请求上报一次
    stateCenter.oss = typeof options.oss === 'number' ? options.oss : 0;
    // 错误发生时捕捉错误现场
    stateCenter.getErrorScene = options.getErrorScene;
    // 使用何种app打开
    stateCenter.app = options.appName || '';
    // 流量来源
    stateCenter.from = options.from || utils.getHostName(document.referrer);

    /**
     * 读取用户设置
     */
    CONST.USER_INIT_BASE_SETTINGS.split(',').forEach(function (i) {
      if (options.hasOwnProperty(i)) {
        config[i] = options[i];
      }
    });
  }

  function init(options) {
    var errorMSg = checkArguments(options);
    if (errorMSg) {
      return utils.tryThrow(errorMSg);
    }

    initialize(options);

    // 发送给后端的echo请求，便于接入层控制
    request({
      url: uri.appendEcho(Client.protocol + '//' + CONST.HOST + '/echo'),
      method: 'GET'
    }, true);
  }

  exports.init = init;
  exports.player = player;
  exports.isReady = isReady;
});