/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
describe('setRoleInfo', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var setRoleInfo = function() {
    DCAgent.setRoleInfo('兽人', '部落', '战士', 1)
  }

  var initAndLogin = function() {
    DCAgent.init({appId: 'setRoleInfo'})
    DCAgent.login('simon')
  }

  it('should throw an error if init is not invoked', function(done) {
    expect(setRoleInfo).toThrow()
    done()
  })

  it('should throw an error if login is not invoked', function() {
    DCAgent.init({appId: 'setRoleInfo'})
    expect(setRoleInfo).toThrow()
  })

  it('should work when init and login are invoked', function() {
    initAndLogin()
    expect(setRoleInfo).not.toThrow()
  })

  it('should trigger ajax in 5 secs', function(done) {
    initAndLogin()
    var count = DCAgent.player.reportCount
    setRoleInfo()
    setTimeout(function() {
      expect(DCAgent.player.reportCount).toEqual(count + 1)
      done()
    }, 5000)
  })

  it('should be the same with what I set', function(done) {
    initAndLogin()
    DCAgent.setRoleInfo('精灵', '联盟', '弓箭手', 2)
    setTimeout(function() {
      var headerInfo = DCAgent.report.headerInfo
      expect(headerInfo).not.toBeUndefined()
      expect(headerInfo.roleId).toEqual('精灵')
      expect(headerInfo.roleRace).toEqual('联盟')
      expect(headerInfo.roleClass).toEqual('弓箭手')
      expect(headerInfo.roleLevel).toEqual(2)
      done()
    }, 5000)
  })
})
