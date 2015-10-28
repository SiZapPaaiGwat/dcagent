/**
 * 内部使用的存取器，在本地存储和cookie中都会存
 * 适合存取设备号等
 */

import storage from '../compats/storage.js'
import Cookie from '../compats/cookie.js'
import wrapKey from './key.js'

export function setItem(key, value) {
  key = wrapKey(key)
  storage.setItem(key, value)
  Cookie.set(key, value, 3650)
}

export function getItem(key) {
  key = wrapKey(key)
  return storage.getItem(key) || Cookie.get(key)
}
