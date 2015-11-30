/*globals ASAP_TIMEOUT, describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, jasmine */
describe('setAge', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var setAge = function() {
    DCAgent.setAge(29)
  }

  var initAndLogin = function() {
    DCAgent.init({appId: 'setAge'})
    DCAgent.login('simon')
  }

  it('should throw an error if init is not invoked', function() {
    expect(setAge).toThrow()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'setAge'})
    expect(setAge).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(setAge).not.toThrow()
  })

  it('should trigger ajax in 2 secs', function() {
    initAndLogin()
    var count = DCAgent.player.reportCount
    setAge()

    jasmine.clock().tick(ASAP_TIMEOUT)
    expect(DCAgent.player.reportCount).toEqual(count + 1)
  })

  !CI_MODE && it('should be the same with what I set', function() {
    initAndLogin()
    DCAgent.setAge(100)

    jasmine.clock().tick(ASAP_TIMEOUT)
    var headerInfo = DCAgent.report.headerInfo
    expect(headerInfo.age).toEqual(100)
  })
})
