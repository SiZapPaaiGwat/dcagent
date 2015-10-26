import onEvent from './onEvent.js'
import * as utils from '../libs/utils.js'
import * as CONST from '../consts.js'

export default function onMissionUnfinished(taskID, elapsed) {
	onEvent(CONST.EVT_MISSION, {
		actionType: 'guankaUnfinish',
		guankaId: taskID,
		duration: utils.parseInt(elapsed)
	})
}
