import config from '../utils/initConfig.js'

export default function setGameServer(serverID = '') {
  config.gameServer = String(serverID)
}
