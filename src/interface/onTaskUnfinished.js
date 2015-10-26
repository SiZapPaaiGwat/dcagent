import onEvent from './onEvent.js'
import * as utils from '../libs/utils.js'
import * as CONST from '../consts.js'

export default function onTaskUnfinished(taskID, elapsed) {
	onEvent(CONST.EVT_TASK, {
		actionType: 'taskUnfinish',
		taskId: taskID,
		elapsed: utils.parseInt(elapsed)
	})
}
