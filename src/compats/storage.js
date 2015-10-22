import {engine} from '../decect/engine.js'
import {hasStorage} from '../decect/client.js'
import {noop} from '../libs/utils.js'
import {win as window} from '../globals'

var storage

/**
 * see egret core at src/context/localStorage/localStorage.ts
 */
if (engine.isEgret) {
  storage = window.egret.localStorage
} else if (engine.isCocos) {
  storage = window.cc.sys.localStorage
} else {
  // layabox也是localStorage
  storage = hasStorage ? window.localStorage : {
    getItem: noop,
    setItem: noop,
    removeItem: noop
  }
}

export default storage
