import * as dataCenter from '../utils/dataCenter.js'
import * as utils from '../libs/utils.js'
import * as onlineTimer from '../utils/onlineTimer.js'
import onlinePolling from '../utils/onlinePolling.js'

export default function onEvent(eventId, json) {
	if (!eventId) {
    utils.tryThrow("Missing eventId")
		return
	}

  var replace = (str) => {
    return str.replace(/%/g, '_')
  }

	// 兼容v1的三个参数的情况
	if (arguments.length > 2) {
		json = arguments[2]
	}

	var eventMap = {}
	if (utils.isObject(json)) {
		for (var key in json) {
			// 没有编码，移除%
			eventMap[replace(key)] = typeof json[key] === 'number' ?
				json[key] : encodeURIComponent(json[key])
		}
	}

  var data = {
    eventId: replace(eventId),
    eventMap: eventMap
  }

  dataCenter.addEvent(data)

  // 立即发送请求
  if (json && json.immediate) {
    onlineTimer.stop()
    onlineTimer.run()
		return false
  }
}
