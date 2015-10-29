/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
describe('setGender', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var setGender = function() {
    DCAgent.setGender(1)
  }

  var initAndLogin = function() {
    DCAgent.init({appId: 'setGender'})
    DCAgent.login('simon')
  }

  it('should throw an error if init is not invoked', function(done) {
    expect(setGender).toThrow()
    done()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'setGender'})
    expect(setGender).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(setGender).not.toThrow()
  })

  it('should trigger ajax in 5 secs', function(done) {
    initAndLogin()
    var count = DCAgent.player.reportCount
    setGender()
    setTimeout(function() {
      expect(DCAgent.player.reportCount).toEqual(count + 1)
      done()
    }, 5000)
  })
})
