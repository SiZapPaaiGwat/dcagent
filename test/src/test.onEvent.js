/*globals ASAP_TIMEOUT, describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, jasmine */
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

  !CI_MODE && it('should convert eventID\'s % to _', function() {
    DCAgent.init({appId: 'event'})
    DCAgent.onEvent('%12%34', {level: 2})
    jasmine.clock().tick(ASAP_TIMEOUT)
    expect(DCAgent.report.eventInfoList[0].eventId).toEqual('_12_34')
  })

  !CI_MODE && it('should convert eventData key\'s % to _', function() {
    DCAgent.init({appId: 'event'})
    DCAgent.onEvent('open', {'%12%34': 10})
    jasmine.clock().tick(ASAP_TIMEOUT)
    expect(Object.keys(DCAgent.report.eventInfoList[0].eventMap)[0]).toEqual('_12_34')
  })

  it('should not trigger ajax after invocation', function() {
    DCAgent.init({appId: 'event'})
    var requestCount = DCAgent.player.reportCount
    DCAgent.onEvent('open_dialog', {level: 1})
    DCAgent.onEvent('open_dialog', {level: 2})
    DCAgent.onEvent('open_dialog', {level: 3})
    expect(DCAgent.player.reportCount).toEqual(requestCount)
  })

  it('should trigger ajax in 5 seconds after invocation', function() {
    DCAgent.init({appId: 'event'})
    var requestCount = DCAgent.player.reportCount
    DCAgent.onEvent('open_dialog', {level: 1})

    jasmine.clock().tick(ASAP_TIMEOUT)
    expect(DCAgent.player.reportCount).toEqual(requestCount + 1)
  })

  it('should send the request right now when specific immediate', function() {
    DCAgent.init({appId: 'event'})
    var requestCount = DCAgent.player.reportCount
    DCAgent.onEvent('open_dialog', {level: 1, immediate: true})
    expect(DCAgent.player.reportCount).toEqual(requestCount + 1)
    var func = function() {
      DCAgent.onEvent('open_dialog', {level: 2, immediate: true})
    }
    expect(func).not.toThrow()
    requestCount = DCAgent.player.reportCount
    // do not trigger asap policy
    jasmine.clock().tick(ASAP_TIMEOUT)
    expect(DCAgent.player.reportCount).toEqual(requestCount)
    // report count + 1 after one period time
    jasmine.clock().tick(35 * 1000)
    expect(DCAgent.player.reportCount).toEqual(requestCount + 1)
  })
})
