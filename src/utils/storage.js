/**
 * 内部使用的存取器，在本地存储和cookie中都会存
 * 适合存取设备号等
 */

import store from '../compats/storage.js'
import Cookie from '../libs/cookie.js'
import wrapKey from './key.js'

export function setItem(key, value) {
  key = wrapKey(key)
  store.setItem(key, value)
  Cookie.set(key, value, 3650)
}

export function getItem(key) {
  key = wrapKey(key)
  return store.getItem(key) || Cookie.get(key)
}


