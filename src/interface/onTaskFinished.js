import onEvent from './onEvent.js'
import * as utils from '../libs/utils.js'
import * as CONST from '../consts.js'

export default function onTaskFinished(taskID, elapsed) {
	elapsed = utils.parseInt(elapsed)

	if (elapsed < 0) {
		utils.tryThrow('Argument error')
		return false
	}

	onEvent(CONST.EVT_TASK, {
		actionType: 'taskFinish',
		taskId: String(taskID),
		elapsed: elapsed
	})
}
