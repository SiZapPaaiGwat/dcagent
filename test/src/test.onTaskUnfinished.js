/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
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

  it('should throw an error if init is not invoked', function(done) {
    expect(onTaskUnfinished).toThrow()
    done()
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

  it('should trigger ajax in 5 secs', function(done) {
    initAndLogin()
    var count = DCAgent.player.reportCount
    onTaskUnfinished()
    setTimeout(function() {
      expect(DCAgent.player.reportCount).toEqual(count + 1)
      done()
    }, ASAP_TIMEOUT)
  })
})
