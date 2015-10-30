/*globals describe, it, expect, DCAgent, beforeEach, afterEach, loadDCAgent, destroyDCAgent, setTimeout, jasmine */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000
describe('rate limit', function() {
  beforeEach(loadDCAgent)

  afterEach(destroyDCAgent)

  var returnValue = {
      "status": 200,
      "contentType": 'text/plain',
      "responseText": 'success',
      "responseHeaders": {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-Rate-Limit',
        'X-Rate-Limit': 100
      }
  }

  it('should reset timer via response header in the init request', function() {
    jasmine.Ajax.withMock(function() {
      DCAgent.init({
        appId: 'rate-limit1',
        interval: 50
      })
      expect(DCAgent.state.interval).toEqual(50 * 1000)
      jasmine.Ajax.requests.mostRecent().respondWith(returnValue)
      expect(DCAgent.state.interval).toEqual(100 * 1000)
    })
  })

  it('should reset timer via response header in the polling request', function(done) {
    DCAgent.init({
      appId: 'rate-limit2',
      interval: 60
    })
    expect(DCAgent.state.interval).toEqual(60 * 1000)
    jasmine.Ajax.install()
    // trigger polling ajax
    DCAgent.onEvent('open')
    setTimeout(function() {
      jasmine.Ajax.requests.mostRecent().respondWith(returnValue)
      expect(DCAgent.state.interval).toEqual(100 * 1000)
      done()
    }, 5000)
  })
})
