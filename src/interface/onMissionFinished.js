import onEvent from './onEvent.js'
import * as utils from '../libs/utils.js'
import * as CONST from '../consts.js'

export default function onMissionFinished(taskID, elapsed) {
	onEvent(CONST.EVT_MISSION, {
		actionType: 'guankaFinish',
		guankaId: taskID,
		duration: utils.parseInt(elapsed)
	})
}
