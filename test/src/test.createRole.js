/*globals ASAP_TIMEOUT, describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, jasmine */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000
describe('createRole', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var createRole = function() {
    DCAgent.createRole('兽人', '部落', '战士', 1)
  }

  var initAndLogin = function(appid) {
    DCAgent.init({appId: appid || 'createRole0'})
    DCAgent.login('simon')
  }

  // it('should throw an error if init is not invoked', function() {
  //   expect(createRole).toThrow()
  // })
  //
  // it('should throw an error if login is not invoked', function() {
  //   DCAgent.init({appId: 'createRole1'})
  //   expect(createRole).toThrow()
  // })
  //
  // it('should work when init and login are invoked', function() {
  //   initAndLogin('createRole2')
  //   expect(createRole).not.toThrow()
  // })
  //
  // it('should trigger ajax in 2 secs', function() {
  //   initAndLogin('createRole3')
  //   var count = DCAgent.player.reportCount
  //   createRole()
  //
  //   jasmine.clock().tick(ASAP_TIMEOUT)
  //   expect(DCAgent.player.reportCount).toEqual(count + 1)
  // })

  it('should be the same with what I set', function() {
    initAndLogin('createRole4')
    createRole()

    jasmine.clock().tick(5000)
    var headerInfo = DCAgent.report.headerInfo
    expect(headerInfo).not.toBeUndefined()
    expect(headerInfo.roleId).toEqual('兽人')
    expect(headerInfo.roleRace).toEqual('部落')
    expect(headerInfo.roleClass).toEqual('战士')
    expect(headerInfo.roleLevel).toEqual(1)
  })
})
