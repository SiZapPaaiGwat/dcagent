import config from '../utils/initConfig.js'

export default function setAccountType(typeID = '') {
  config.accountType = String(typeID)
}
