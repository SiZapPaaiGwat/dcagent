/*globals describe, it, expect, DCAgent*/
describe('DCAgent.init ', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  // appid不能为空
  it('should throw an error when appId is empty', function() {
    expect(DCAgent.init).toThrow()

    var init = function() {
      DCAgent.init({appId: ''})
    }
    expect(init).toThrow()
  })

  // 正常流程
  it('should work when appId is supplied', function() {
    var init = function() {
      DCAgent.init({appId: 'abc'})
    }

    expect(init).not.toThrow()
    expect(DCAgent.isReady()).toBe(true)
  })

  // 多次初始化报错
  it('should throw error when invoke init twice', function() {
    var init = function() {
      DCAgent.init({appId: 'abc'})
    }
    expect(init).toThrow()
  })
})
