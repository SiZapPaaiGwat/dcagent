/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
describe('onTaskUnfinished', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var onTaskUnfinished = function() {
    DCAgent.onTaskUnfinished('首冲送大礼', 20)
  }

  var initAndLogin = function() {
    DCAgent.init({appId: 'onTaskUnfinished'})
    DCAgent.login('simon')
  }

  it('should throw an error if init is not invoked', function() {
    expect(onTaskUnfinished).toThrow()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'onTaskUnfinished'})
    expect(onTaskUnfinished).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(onTaskUnfinished).not.toThrow()
  })

  it('should throw an error since elapsed is less than zero', function() {
    initAndLogin()
    var onTaskUnfinished1 = function() {
      DCAgent.onTaskUnfinished('首冲送大礼', -1)
    }
    expect(onTaskUnfinished1).toThrow()
  })

  it('should trigger ajax in 2 secs', function() {
    initAndLogin()
    var count = DCAgent.player.reportCount
    onTaskUnfinished()

    jasmine.clock().tick(ASAP_TIMEOUT)
    expect(DCAgent.player.reportCount).toEqual(count + 1)
  })
})
