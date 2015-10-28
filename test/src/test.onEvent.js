/*globals describe, it, expect, DCAgent, setTimeout, jasmine*/
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
describe('DCAgent.onEvent()', function() {
  it('should throw an error when there is no initialization', function() {
    expect(DCAgent.onEvent).toThrow()
  })

  it('should throw an error when there is no argument', function() {
    DCAgent.init({appId: 'event'})
    expect(DCAgent.onEvent).toThrow()
  })

  it('should support invocation with three arguments (old way)', function() {
    var onEvent = function() {
      DCAgent.onEvent('open_dialog', 10, {level: 1})
    }
    expect(onEvent).not.toThrow()
  })

  it('should support invocation with two arguments (new way)', function() {
    var onEvent = function() {
      DCAgent.onEvent('open_dialog', {level: 2})
    }
    expect(onEvent).not.toThrow()
  })

  describe('eventID', function() {
    it('should convert % to _', function() {
      var event = DCAgent.onEvent('%12%34', {level: 2})
      expect(event.eventId).toEqual('_12_34')
    })
  })

  describe('event data', function() {
    it('should convert % to _ in event data key', function() {
      var event = DCAgent.onEvent('open', {'%12%34': 10})
      var key = Object.keys(event.eventMap)[0]
      expect(key).toEqual('_12_34')
    })
  })

  // 频率控制
  describe('request debounce', function() {
    var requestCount

    it('should not trigger ajax after multiple invocation', function() {
      requestCount = DCAgent.player.reportCount
      DCAgent.onEvent('open_dialog', {level: 1})
      DCAgent.onEvent('open_dialog', {level: 2})
      DCAgent.onEvent('open_dialog', {level: 3})
      expect(DCAgent.player.reportCount).toEqual(requestCount)
    })

    it('should trigger ajax in 5 seconds after multiple invocation', function(done) {
      setTimeout(function() {
        expect(DCAgent.player.reportCount).toEqual(requestCount + 1)
        done()
      }, 5000)
    })
  })
})
