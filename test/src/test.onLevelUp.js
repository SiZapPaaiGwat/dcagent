/*globals ASAP_TIMEOUT, describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, jasmine */
describe('onLevelUp', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var onLevelUp = function() {
    DCAgent.onLevelUp(11, 12, 30)
  }

  var initAndLogin = function() {
    DCAgent.init({appId: 'onLevelUp'})
    DCAgent.login('simon')
  }

  it('should throw an error if init is not invoked', function() {
    expect(onLevelUp).toThrow()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'onLevelUp'})
    expect(onLevelUp).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(onLevelUp).not.toThrow()
  })

  it('should throw an error since startLevel/endLevel/elapsed is less than zero', function() {
    initAndLogin()
    var onLevelUp1 = function() {
      DCAgent.onLevelUp(-1, 12, 30)
    }
    var onLevelUp2 = function() {
      DCAgent.onLevelUp(11, -1, 30)
    }
    var onLevelUp3 = function() {
      DCAgent.onLevelUp(11, 12, -1)
    }
    expect(onLevelUp1).toThrow()
    expect(onLevelUp2).toThrow()
    expect(onLevelUp3).toThrow()
  })

  it('should trigger ajax in 2 secs', function() {
    initAndLogin()
    var count = DCAgent.player.reportCount
    onLevelUp()

    jasmine.clock().tick(ASAP_TIMEOUT)
    expect(DCAgent.player.reportCount).toEqual(count + 1)
  })
})
