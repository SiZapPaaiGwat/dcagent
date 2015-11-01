/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
describe('onMissionFinished', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var onMissionFinished = function() {
    DCAgent.onMissionFinished('关卡1', 20)
  }

  var initAndLogin = function() {
    DCAgent.init({appId: 'onMissionFinished'})
    DCAgent.login('simon')
  }

  it('should throw an error if init is not invoked', function() {
    expect(onMissionFinished).toThrow()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'onMissionFinished'})
    expect(onMissionFinished).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(onMissionFinished).not.toThrow()
  })

  it('should throw an error since elapsed is less than zero', function() {
    initAndLogin()
    var onMissionFinished1 = function() {
      DCAgent.onMissionFinished('关卡1', -1)
    }
    expect(onMissionFinished1).toThrow()
  })

  it('should trigger ajax in 2 secs', function() {
    initAndLogin()
    var count = DCAgent.player.reportCount
    onMissionFinished()

    jasmine.clock().tick(ASAP_TIMEOUT)
    expect(DCAgent.player.reportCount).toEqual(count + 1)
  })
})
