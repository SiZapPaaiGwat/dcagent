/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
describe('createRole', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var createRole = function() {
    DCAgent.createRole('兽人', '部落', '战士', 1)
  }

  var initAndLogin = function() {
    DCAgent.init({appId: 'createRole'})
    DCAgent.login('simon')
  }

  it('should throw an error if init is not invoked', function(done) {
    expect(createRole).toThrow()
    done()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'createRole'})
    expect(createRole).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(createRole).not.toThrow()
  })

  it('should trigger ajax in 5 secs', function(done) {
    initAndLogin()
    var count = DCAgent.player.reportCount
    createRole()
    setTimeout(function() {
      expect(DCAgent.player.reportCount).toEqual(count + 1)
      done()
    }, 5000)
  })
})
