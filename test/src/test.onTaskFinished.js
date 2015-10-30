/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
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

  it('should throw an error if init is not invoked', function(done) {
    expect(onTaskFinished).toThrow()
    done()
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

  it('should trigger ajax in 5 secs', function(done) {
    initAndLogin()
    var count = DCAgent.player.reportCount
    onTaskFinished()
    setTimeout(function() {
      expect(DCAgent.player.reportCount).toEqual(count + 1)
      done()
    }, 5000)
  })
})
