import stateCenter from '../utils/stateCenter.js'

export default function isReady() {
  return stateCenter.inited
}
