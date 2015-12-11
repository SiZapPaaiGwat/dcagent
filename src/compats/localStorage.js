/**
 * 本地存储封装
 */

import {engine} from '../detect/engine.js'
import {hasStorage} from '../detect/client.js'
import {window} from '../globals.js'
import {noop} from '../libs/utils.js'

var localstorage

/**
 * see egret core at src/context/localStorage/localStorage.ts
 */
if (engine.isEgret) {
  localstorage = window.egret.localStorage
} else if (engine.isCocos) {
  localstorage = window.cc.sys.localStorage
} else {
  // layabox也是localStorage
  localstorage = hasStorage ? window.localStorage : {
    getItem: noop,
    setItem: noop,
    removeItem: noop
  }
}

export default localstorage
