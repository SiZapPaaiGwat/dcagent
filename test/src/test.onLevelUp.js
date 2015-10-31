/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
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

  it('should throw an error if init is not invoked', function(done) {
    expect(onLevelUp).toThrow()
    done()
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

  it('should trigger ajax in 5 secs', function(done) {
    initAndLogin()
    var count = DCAgent.player.reportCount
    onLevelUp()
    setTimeout(function() {
      expect(DCAgent.player.reportCount).toEqual(count + 1)
      done()
    }, ASAP_TIMEOUT)
  })
})
