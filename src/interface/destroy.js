import {cancel} from '../utils/onlineTimer.js'
import stateCenter from '../utils/stateCenter.js'

export default function() {
  cancel()

  stateCenter.destroyed = true
}
