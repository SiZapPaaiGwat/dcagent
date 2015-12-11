/**
 * 内部使用的存取器，uid在本地存储和cookie中都会存
 * 其它方法模拟localstorage
 */

import localstorage from '../compats/localStorage.js'
import Cookie from '../compats/cookie.js'
import wrapKey from './key.js'

export function setUID(key, value) {
  key = wrapKey(key)
  localstorage.setItem(key, value)
  Cookie.set(key, value, 3650)
}

export function getUID(key) {
  key = wrapKey(key)
  return localstorage.getItem(key) || Cookie.get(key)
}

export function setItem(key, value) {
  localstorage.setItem(wrapKey(key), value)
}

export function getItem(key) {
  return localstorage.getItem(wrapKey(key))
}

export function removeItem(key) {
  localstorage.removeItem(wrapKey(key))
}
