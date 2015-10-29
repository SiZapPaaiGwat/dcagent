/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent*/
describe('init', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

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
})
