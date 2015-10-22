/**
 * https://github.com/sdkjs/hasdom
 * 检测是否是真实的浏览器
 * 很多无dom的环境存在一些虚拟对象，需要实际验证
 */

import {doc as document} from '../globals.js'
import {isFunction} from './utils.js'

export default function() {

  if (document && isFunction(document.createElement)) {
    /**
     * document.createElement is not reliable
     * since there is some kind browser you can just create canvas only
     */
    var node = document.createElement('div')

    /**
     * node may be an empty object or null (layabox earlier version)
     */
    if (!node) return false

    /**
     * detect logic, create dom and exec query
     */
    if (isFunction(node.querySelector)) {
      node.innerHTML = '<i></i>'

      var el = node.querySelector('i')

      return !!el && el.tagName === 'I'
    }

    /**
     * for old browsers such as IE version < 9
     */
    if (isFunction(node.getElementsByTagName)) {
      var children = node.getElementsByTagName('i')

      return !!children && children.length === 1
    }
  }

  return false
}
