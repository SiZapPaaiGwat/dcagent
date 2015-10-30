/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
describe('setGameServer', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var setGameServer = function() {
    DCAgent.setGameServer('第九区')
  }

  var initAndLogin = function() {
    DCAgent.init({appId: 'setGameServer'})
    DCAgent.login('simon')
  }

  it('should throw an error if init is not invoked', function(done) {
    expect(setGameServer).toThrow()
    done()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'setGameServer'})
    expect(setGameServer).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(setGameServer).not.toThrow()
  })

  it('should trigger ajax in 5 secs', function(done) {
    initAndLogin()
    var count = DCAgent.player.reportCount
    setGameServer()
    setTimeout(function() {
      expect(DCAgent.player.reportCount).toEqual(count + 1)
      done()
    }, 5000)
  })

  it('should be the same with what I set', function(done) {
    initAndLogin()
    DCAgent.setGameServer('第六区')
    setTimeout(function() {
      var headerInfo = DCAgent.report.headerInfo
      expect(headerInfo.gameServer).toEqual('第六区')
      done()
    }, 5000)
  })
})
