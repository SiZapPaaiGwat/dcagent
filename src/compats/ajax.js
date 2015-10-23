/**
 * 适用于一般js环境的ajax封装，调用方式：
 * ajax({
 *   opts.url
 *   opts.method
 *   opts.data
 *   opts.success
 *   opts.error
 *   opts.complete
 *   opts.timeout
 * })
 */

import {window} from  '../globals.js'
import {engine} from '../detect/engine.js'
import * as utils from '../libs/utils.js'

/**
 * for standard browser and layabox, or cocos
 */
function createCocosXHR() {
  return window.cc.loader.getXMLHttpRequest()
}

function createBrowserXHR() {
  return new window.XMLHttpRequest()
}

var createXHR = engine.isCocos ? createCocosXHR : createBrowserXHR

/**
 * for Egret Runtime and Native
 */
function egretRequest(opts) {
  var egret = window.egret
  var loader = new egret.URLLoader()
  var start = Date.now()

  loader.addEventListener(egret.Event.COMPLETE, function onNativeRequestComplete(e) {
    var elapsed = Date.now() - start
    var context = e.target
    var isValid = context.data === 'success'

    utils.attemp(isValid ? opts.success : opts.error, context, [context, elapsed, elapsed >= opts.timeout])
    utils.attemp(opts.complete, context, [context, elapsed])
    // TODO 白鹭这里能够获取headers吗？
  })

  var request = new egret.URLRequest(opts.url)
  request.method = opts.method || egret.URLRequestMethod.POST
  request.data = utils.JSONStringify(opts.data)
  loader.load(request)
}

function request(opts) {
  var xhr = createXHR()
  /**
   * 切断网络或者手机切到后台可能导致timeout
   */
  xhr.timeout = opts.timeout
  xhr.open(opts.method || 'POST', opts.url, true)
  xhr.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8')

  var start = Date.now()

  xhr.onreadystatechange = function() {
    if (this.readyState !== 4) return

    var isValid = this.status >=200 && this.status < 300
    var elapsed = Date.now() - start

    utils.attemp(isValid ? opts.success : opts.error, this, [this, elapsed])
    utils.attemp(opts.complete, this, [this, elapsed])

    this.onreadystatechange = null
    this.ontimeout = null
  }

  xhr.ontimeout = function() {
    var elapsed = Date.now() - start

    utils.attemp(opts.error, this, [this, elapsed, true])
    utils.attemp(opts.complete, this, [this, elapsed])

    this.onreadystatechange = null
    this.ontimeout = null
  }

  xhr.send(utils.JSONStringify(opts.data))
}

var Ajax = (() => {
  // for browser layabox cocos
  if (window.XMLHttpRequest || engine.isCocos) return request

  if (engine.isEgret) return egretRequest

  utils.log('XMLHttpRequest not found')
  return utils.noop
})()

export default Ajax
