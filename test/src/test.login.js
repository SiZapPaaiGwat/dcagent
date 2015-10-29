/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent */
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

  it('should work when init is invoked', function(done) {
    var start = Math.floor(Date.now() / 1000) - 1
    var login = function() {
      DCAgent.init({appId: 'appid'})
      DCAgent.login('simon')
    }
    expect(login).not.toThrow()

    setTimeout(function() {
      var end = Math.ceil(Date.now() / 1000)
      var loginTime = DCAgent.player.loginTime
      expect(loginTime).toBeLessThan(end)
      expect(loginTime).toBeGreaterThan(start)

      done()
    }, 1000)
  })

  it('should not change login time when account id is the same', function(done) {
    DCAgent.init({appId: 'appid'})
    DCAgent.login('simon')
    var loginTime = DCAgent.player.loginTime

    setTimeout(function() {
      DCAgent.login('simon')
      expect(loginTime).toEqual(DCAgent.player.loginTime)
      done()
    }, 1000)
  })

  it('should change the login time when account id is different', function(done) {
    DCAgent.init({appId: 'appid'})
    DCAgent.login('simon')
    var loginTime = DCAgent.player.loginTime

    setTimeout(function() {
      DCAgent.login('grace')
      expect(loginTime).not.toEqual(DCAgent.player.loginTime)
      expect(loginTime).toBeLessThan(DCAgent.player.loginTime)
      done()
    }, 1000)
  })
})
