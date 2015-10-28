/*globals describe, it, expect, DCAgent, beforeEach, setTimeout*/
describe('DCAgent.login()', function() {
  // SDK内部的时间基于秒，有些操作需要设置执行间隔
  beforeEach(function(done) {
    setTimeout(function() {
      done()
    }, 1000)
  })

  it('should throw an error when init is not executed', function() {
    var login = function() {
      DCAgent.login('simon')
    }
    expect(login).toThrow()
    expect(DCAgent.player.loginTime).toBeUndefined()
  })

  describe('after init', function() {
    var loginTime
    it('should work', function() {
      // 减一秒，防止时间精度不够
      var start = Math.floor(Date.now() / 1000) - 1
      var login = function() {
        DCAgent.init({appId: 'appid'})
        DCAgent.login('simon')
      }
      expect(login).not.toThrow()

      var end = Math.ceil(Date.now() / 1000)
      loginTime = DCAgent.player.loginTime
      expect(loginTime).toBeLessThan(end)
      expect(loginTime).toBeGreaterThan(start)
    })

    it('should get the same login time when account id is identical', function() {
      DCAgent.login('simon')
      expect(loginTime).toEqual(DCAgent.player.loginTime)
    })

    it('should not get the same time when account id is not identical', function() {
      DCAgent.login('grace')
      expect(loginTime).not.toEqual(DCAgent.player.loginTime)
      expect(loginTime).toBeLessThan(DCAgent.player.loginTime)
    })
  })
})
