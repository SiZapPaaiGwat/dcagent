import * as dataCenter from '../utils/dataCenter.js'
import * as utils from '../libs/utils.js'

export default function onEvent(eventId, json) {
	if (!eventId) {
    utils.log("Missing eventId")
		return false
	}

	// 兼容v1的三个参数的情况
	if (arguments.length > 2) {
		json = arguments[2]
	}

	var jsonStr = {}
	if (utils.isObject(json)) {
		for (var key in json) {
			// 没有编码，移除%
			jsonStr[key.replace('%', '_')] = typeof json[key] === 'number' ?
				json[key] :
				encodeURIComponent(json[key])
		}
	}

  dataCenter.addEvent({
    eventId: eventId,
    eventMap: jsonStr
  })

  return true
}
