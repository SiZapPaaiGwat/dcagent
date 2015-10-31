/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
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

  it('should throw an error if init is not invoked', function(done) {
    expect(onMissionUnfinished).toThrow()
    done()
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

  it('should trigger ajax in 5 secs', function(done) {
    initAndLogin()
    var count = DCAgent.player.reportCount
    onMissionUnfinished()
    setTimeout(function() {
      expect(DCAgent.player.reportCount).toEqual(count + 1)
      done()
    }, ASAP_TIMEOUT)
  })
})
