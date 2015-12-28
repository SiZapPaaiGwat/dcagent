/* jshint ignore:start*/
var DCAGENT_DEBUG_OPEN = true
var ASAP_TIMEOUT = 5000
// 有些单元测试在ci模式下通不过，不知道什么原因
var CI_MODE = true

// 每个Spec开始的时候重新加载SDK避免被上次的结果影响
function loadDCAgent(done) {
  var script = document.createElement('script')
  script.src = 'base/dist/dcagent.v2.src.js?v=' + Date.now()
  script.setAttribute('id', 'dcagent')
  script.onload = done
  document.body.appendChild(script)
}

// 每个Spec结束的时候销毁SDK，避免遗漏的Timer影响数据
function destroyDCAgent(done) {
  var script = document.querySelector('#dcagent')
  document.body.removeChild(script)
  DCAgent.destroy()
  DCAgent = null
  done()
}

jasmine.clock().install()
// 这里也必须mockDate，不然有些Spec会失败
jasmine.clock().mockDate(new Date(2015, 11, 1))
jasmine.Ajax.install()
jasmine.Ajax.stubRequest(/http:\/\/rd.gdatacube.net\/.+/).andReturn({
  "status": 200,
  "contentType": 'text/plain',
  "responseText": 'success',
  "responseHeaders": {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Rate-Limit',
    'X-Rate-Limit': 100
  }
})
