import * as Client from '../detect/client.js'
import Cookie from '../libs/cookie.js'
import * as utils from '../libs/utils.js'

var cookie = Client.hasCookie ? Cookie : {
  get: utils.noop,
  set: utils.noop
}

export default cookie
