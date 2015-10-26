/**
 * 在uri中附加uid方便接入层操作
 */

import config from './initConfig.js'

export function appendOnline(uri) {
  return uri + '?__deuid=' + config.uid + '&__deappid=' + config.appId
}

export function appendEcho(uri) {
  return `${uri}?type=h520&appId=${config.appId}&uid=${config.uid}&mac=${config.mac || ''}&imei=${config.imei || ''}&idfa=${config.idfa || ''}`
}
