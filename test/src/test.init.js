/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, localStorage*/
describe('init', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var setItem = localStorage.setItem
  var getItem = localStorage.getItem

  // appid不能为空
  it('throws an error when appid is not supplied', function() {
    expect(DCAgent.init).toThrow()

    var init = function() {
      DCAgent.init({appId: ''})
    }
    expect(init).toThrow()
  })

  // 正常流程
  it('works when appid is not empty', function() {
    var init = function() {
      DCAgent.init({appId: 'abc'})
    }

    expect(init).not.toThrow()
    expect(DCAgent.isReady()).toBe(true)
  })

  // 多次初始化报错
  it('should not support multiple invocation', function() {
    var init = function() {
      DCAgent.init({appId: 'abc'})
      DCAgent.init({appId: 'abc'})
    }
    expect(init).toThrow()
  })

  it('should throw an error if uid is not supplied and localstorage is not support', function() {
    // can not set localStorage to null in browser
    // create a private mode
    localStorage.setItem = function() {}
    localStorage.getItem = function() {}
    var init = function() {
      DCAgent.init({appId: 'init_uid'})
    }
    expect(init).toThrow()
    // do not affect other specs
    localStorage.setItem = setItem
    localStorage.getItem = getItem
  })

  it('should work if uid is supplied even localstorage is not support', function() {
    // localStorage is not writable in firefox
    localStorage.setItem = function() {}
    localStorage.getItem = function() {}
    var init = function() {
      DCAgent.init({appId: 'init_uid', uid: 'my_uid'})
    }
    expect(init).not.toThrow()
    localStorage.setItem = setItem
    localStorage.getItem = getItem
  })

  var uid
  it('should create uid in localstorage based on appid', function() {
    var appid = Date.now().toString()
    DCAgent.init({appId: appid})
    uid = localStorage.getItem(appid + '.dcagent_client_id')
    expect(uid).toBeTruthy()
  })

  it('should not share data between different applications in one domain', function() {
    var appid = Date.now().toString()
    DCAgent.init({appId: appid})
    var uid2 = localStorage.getItem(appid + '.dcagent_client_id')
    expect(uid).toEqual(uid2)
  })
})
