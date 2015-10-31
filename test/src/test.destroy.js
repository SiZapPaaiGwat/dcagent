/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
describe('destroy', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var init = function() {
    DCAgent.init({appId: 'destroy'})
  }

  // init based
  var onEvent = function() {
    DCAgent.onEvent('destroy')
  }

  // login based
  var onCoinGet = function() {
    DCAgent.onCoinGet(100, 300, '金币', '完成任务获得奖励')
  }

  it('should throw an error when init is invoked', function() {
    DCAgent.destroy()
    expect(init).toThrow()
  })

  it('should clear online timer', function(done) {
    init()
    DCAgent.destroy()
    var count = DCAgent.player.reportCount
    setTimeout(function() {
      expect(count).toEqual(DCAgent.player.reportCount)
      expect(onEvent).toThrow()
      expect(onCoinGet).toThrow()
      done()
    }, ASAP_TIMEOUT)
  })
})
