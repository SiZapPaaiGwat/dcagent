/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
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

  it('should throw an error if init is not invoked', function() {
    expect(setGameServer).toThrow()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'setGameServer'})
    expect(setGameServer).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(setGameServer).not.toThrow()
  })

  it('should trigger ajax in 2 secs', function() {
    initAndLogin()
    var count = DCAgent.player.reportCount
    setGameServer()

    jasmine.clock().tick(ASAP_TIMEOUT)
    expect(DCAgent.player.reportCount).toEqual(count + 1)
  })

  it('should be the same with what I set', function() {
    initAndLogin()
    DCAgent.setGameServer('第六区')

    jasmine.clock().tick(ASAP_TIMEOUT)
    var headerInfo = DCAgent.report.headerInfo
    expect(headerInfo.gameServer).toEqual('第六区')
  })
})
