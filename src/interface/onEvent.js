import * as dataCenter from '../utils/dataCenter.js'
import * as utils from '../libs/utils.js'

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

	var jsonStr = {}
	if (utils.isObject(json)) {
		for (var key in json) {
			// 没有编码，移除%
			jsonStr[replace(key)] = typeof json[key] === 'number' ?
				json[key] :
				encodeURIComponent(json[key])
		}
	}

  var sendData = {
    eventId: replace(eventId),
    eventMap: jsonStr
  }
  dataCenter.addEvent(sendData)

  return sendData
}
