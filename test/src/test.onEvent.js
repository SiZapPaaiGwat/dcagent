/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, jasmine, setTimeout */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
describe('onEvent', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  it('should throw an error when init is not invoked', function() {
    expect(DCAgent.onEvent).toThrow()
  })

  it('should throw an error when there is no argument', function() {
    DCAgent.init({appId: 'event'})
    expect(DCAgent.onEvent).toThrow()
  })

  it('should support invocation with three arguments (old way)', function() {
    var onEvent = function() {
      DCAgent.init({appId: 'event'})
      DCAgent.onEvent('open_dialog', 10, {level: 1})
    }
    expect(onEvent).not.toThrow()
  })

  it('should support invocation with two arguments (new way)', function() {
    var onEvent = function() {
      DCAgent.init({appId: 'event'})
      DCAgent.onEvent('open_dialog', {level: 2})
    }
    expect(onEvent).not.toThrow()
  })

  it('should convert eventID\'s % to _', function() {
    DCAgent.init({appId: 'event'})
    var event = DCAgent.onEvent('%12%34', {level: 2})
    expect(event.eventId).toEqual('_12_34')
  })

  it('should convert eventData key\'s % to _', function() {
    DCAgent.init({appId: 'event'})
    var event = DCAgent.onEvent('open', {'%12%34': 10})
    var key = Object.keys(event.eventMap)[0]
    expect(key).toEqual('_12_34')
  })

  it('should not trigger ajax after invocation', function() {
    DCAgent.init({appId: 'event'})
    var requestCount = DCAgent.player.reportCount
    DCAgent.onEvent('open_dialog', {level: 1})
    DCAgent.onEvent('open_dialog', {level: 2})
    DCAgent.onEvent('open_dialog', {level: 3})
    expect(DCAgent.player.reportCount).toEqual(requestCount)
  })

  it('should trigger ajax in 5 seconds after invocation', function(done) {
    DCAgent.init({appId: 'event'})
    var requestCount = DCAgent.player.reportCount
    DCAgent.onEvent('open_dialog', {level: 1})

    setTimeout(function() {
      expect(DCAgent.player.reportCount).toEqual(requestCount + 1)
      done()
    }, 5000)
  })
})
