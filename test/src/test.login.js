/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout */
describe('login', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  it('should invoke after init', function() {
    var login = function() {
      DCAgent.login('simon')
    }
    expect(login).toThrow()
    expect(DCAgent.player.loginTime).toBeUndefined()
  })

  it('should work when init is invoked', function() {
    var start = Math.floor(Date.now() / 1000) - 1
    var login = function() {
      DCAgent.init({appId: 'appid'})
      DCAgent.login('simon')
    }
    expect(login).not.toThrow()

    jasmine.clock().tick(1000)
    var end = Math.ceil(Date.now() / 1000)
    var loginTime = DCAgent.player.loginTime
    expect(loginTime).toBeLessThan(end)
    expect(loginTime).toBeGreaterThan(start)
  })

  it('should not change login time when account id is the same', function() {
    DCAgent.init({appId: 'appid'})
    DCAgent.login('simon')
    var loginTime = DCAgent.player.loginTime

    jasmine.clock().tick(1000)
    DCAgent.login('simon')
    expect(loginTime).toEqual(DCAgent.player.loginTime)
  })

  it('should change the login time when account id is different', function() {
    DCAgent.init({appId: 'appid'})
    DCAgent.login('simon')
    var loginTime = DCAgent.player.loginTime

    // 内部使用的秒存储登录时间，精度不够，等待1秒
    jasmine.clock().tick(1000)
    DCAgent.login('grace')
    expect(loginTime).not.toEqual(DCAgent.player.loginTime)
    expect(loginTime).toBeLessThan(DCAgent.player.loginTime)
  })
})
