/*globals ASAP_TIMEOUT, describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, jasmine */
describe('setGender', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var setGender = function() {
    DCAgent.setGender(1)
  }

  var initAndLogin = function() {
    DCAgent.init({appId: 'setGender'})
    DCAgent.login('simon')
  }

  it('should throw an error if init is not invoked', function() {
    expect(setGender).toThrow()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'setGender'})
    expect(setGender).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(setGender).not.toThrow()
  })

  it('should trigger ajax in 2 secs', function() {
    initAndLogin()
    var count = DCAgent.player.reportCount
    setGender()

    jasmine.clock().tick(ASAP_TIMEOUT)
    expect(DCAgent.player.reportCount).toEqual(count + 1)
  })

  !CI_MODE && it('should be the same with what I set', function() {
    initAndLogin()
    DCAgent.setGender(2)

    jasmine.clock().tick(ASAP_TIMEOUT)
    var headerInfo = DCAgent.report.headerInfo
    expect(headerInfo.gender).toEqual(2)
  })
})
