/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
describe('onMissionUnfinished', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var onMissionUnfinished = function() {
    DCAgent.onMissionUnfinished('关卡1', 20)
  }

  var initAndLogin = function() {
    DCAgent.init({appId: 'onMissionUnfinished'})
    DCAgent.login('simon')
  }

  it('should throw an error if init is not invoked', function() {
    expect(onMissionUnfinished).toThrow()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'onMissionUnfinished'})
    expect(onMissionUnfinished).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(onMissionUnfinished).not.toThrow()
  })

  it('should throw an error since elapsed is less than zero', function() {
    initAndLogin()
    var onMissionUnfinished1 = function() {
      DCAgent.onMissionUnfinished('关卡1', -1)
    }
    expect(onMissionUnfinished1).toThrow()
  })

  it('should trigger ajax in 2 secs', function() {
    initAndLogin()
    var count = DCAgent.player.reportCount
    onMissionUnfinished()

    jasmine.clock().tick(ASAP_TIMEOUT)
    expect(DCAgent.player.reportCount).toEqual(count + 1)
  })
})
