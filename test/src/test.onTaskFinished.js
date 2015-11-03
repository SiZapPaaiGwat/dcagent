/*globals ASAP_TIMEOUT, describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, jasmine */
describe('onTaskFinished', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var onTaskFinished = function() {
    DCAgent.onTaskFinished('完善资料', 20)
  }

  var initAndLogin = function() {
    DCAgent.init({appId: 'onTaskFinished'})
    DCAgent.login('simon')
  }

  it('should throw an error if init is not invoked', function() {
    expect(onTaskFinished).toThrow()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'onTaskFinished'})
    expect(onTaskFinished).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(onTaskFinished).not.toThrow()
  })

  it('should throw an error since elapsed is less than zero', function() {
    initAndLogin()
    var onTaskFinished1 = function() {
      DCAgent.onTaskFinished('完善资料', -1)
    }
    expect(onTaskFinished1).toThrow()
  })

  it('should trigger ajax in 2 secs', function() {
    initAndLogin()
    var count = DCAgent.player.reportCount
    onTaskFinished()

    jasmine.clock().tick(ASAP_TIMEOUT)
    expect(DCAgent.player.reportCount).toEqual(count + 1)
  })
})
