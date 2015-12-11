/*globals ASAP_TIMEOUT, describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, jasmine */
describe('rate limit', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)


  it('should reset timer via response header in the init request', function() {
    DCAgent.init({
      appId: 'rate-limit1',
      interval: 50
    })
    expect(DCAgent.state.interval).toEqual(50 * 1000)
    jasmine.clock().tick(50 * 1000)
    expect(DCAgent.state.interval).toEqual(100 * 1000)
  })

  it('should reset timer via response header in the polling request', function() {
    DCAgent.init({
      appId: 'rate-limit2',
      interval: 60
    })
    expect(DCAgent.state.interval).toEqual(60 * 1000)
    // trigger polling ajax
    DCAgent.onEvent('open')

    jasmine.clock().tick(ASAP_TIMEOUT)
    expect(DCAgent.state.interval).toEqual(100 * 1000)
  })
})
