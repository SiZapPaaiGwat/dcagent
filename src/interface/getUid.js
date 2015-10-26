import initConfig from '../utils/initConfig.js'

export default function getUid() {
  return initConfig.uid || ''
}
