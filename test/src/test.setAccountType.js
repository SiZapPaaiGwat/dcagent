/*globals ASAP_TIMEOUT, describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, jasmine */
describe('setAccountType', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var setAccountType = function() {
    DCAgent.setAccountType('guest')
  }

  var initAndLogin = function() {
    DCAgent.init({appId: 'setAccountType'})
    DCAgent.login('simon')
  }

  it('should throw an error if init is not invoked', function() {
    expect(setAccountType).toThrow()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'setAccountType'})
    expect(setAccountType).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(setAccountType).not.toThrow()
  })

  it('should trigger ajax in 2 secs', function() {
    initAndLogin()
    var count = DCAgent.player.reportCount
    setAccountType()

    jasmine.clock().tick(ASAP_TIMEOUT)
    expect(DCAgent.player.reportCount).toEqual(count + 1)
  })

  !CI_MODE && it('should be the same with what I set', function() {
    initAndLogin()
    DCAgent.setAccountType('VIP')

    jasmine.clock().tick(ASAP_TIMEOUT)
    var headerInfo = DCAgent.report.headerInfo
    expect(headerInfo.accountType).toEqual('VIP')
  })
})
