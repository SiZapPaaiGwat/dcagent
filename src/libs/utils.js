/**
 * 通用的辅助类
 */

import {document, window} from '../globals.js'

var toString = Object.prototype.toString

export var isDebug = window.DCAGENT_DEBUG_OPEN

/*
 * 不做任何操作的空函数，用于各种兼容处理
 */
export function noop() {}

export function isFunction(fn) {
    return typeof fn === 'function'
}

// plain object, no Array, dom, function
export function isObject(value) {
    return value && toString.call(value) === '[object Object]'
}

export function log(msg) {
  console.log(`---- DCAgent log start ----\n${msg}\n---- DCAgent log end   ----`)
}

/**
 * debug环境抛错，正式环境打印日志
 */
export var tryThrow = isDebug ? (msg) => {
  throw new Error(msg)
} : (msg) => {
  log(msg)
}

/**
 * generate a fake UUID
 * demo on http://jsfiddle.net/briguy37/2MVFd/
 * from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 *
 * @returns {string}
 */
export function uuid(prefix) {
    var d, formatter, uid
    d = Date.now()
    formatter = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    uid = formatter.replace(/[xy]/g, (c) => {
        var r
        r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        if (c === 'x') {
            return r.toString(16)
        } else {
            return (r & 0x7 | 0x8).toString(16)
        }
    })

    return (prefix || '') + uid.replace(/-/g, '').toUpperCase()
}

/*
 * 扩展目标对象，只支持表单post的一级扩展
 * extend({}, {a: 1}, {b: 2})
 */
export function extend(target) {
    var key, val
    for (key in target) {
        val = target[key]
        target[key] = val
    }

    var params = arguments.length >= 2 ? [].slice.call(arguments, 1) : []
    params.forEach((param) => {
        var _results
        _results = []
        for (key in param) {
            val = param[key]
            _results.push(target[key] = val)
        }

        return _results
    })

    return target
}

/**
 * 安全执行函数
 * debug环境需要跑出错误不能catch，否则测试通不过
 */
export var attempt = isDebug ? (fn, context, args) => {
  if (!isFunction(fn)) return

  return fn.apply(context, args)
} : (fn, context, args) => {
  if (!isFunction(fn)) return

  try{
    return fn.apply(context, args)
  } catch(e) {
    log(`exec error for function:\n ${fn.toString()}`)
  }
}

/**
 * 测试是否真的支持本地存储，safari无痕模式会报异常
 * http://stackoverflow.com/questions/14555347/html5-localstorage-error-with-safari-quota-exceeded-err-dom-exception-22-an
 *
 * 测试本地存储quota https://arty.name/localstorage.html
 */
export function isLocalStorageSupported(storage) {
	var key = '.'
	try {
		storage.setItem(key, key)
		storage.removeItem(key)
		return true
	} catch (e) {
		return false
	}
}

/**
 * 重复某个字符串N次
 */
export function repeat(str, len = 0) {
	var ret = ''
	for(var i = 0;i < len; i += 1) {
		ret += str
	}

	return ret
}

/**
 * 补齐字符串到指定最小长度
 */
export function padding(original, paddingStr, len) {
  if (!original) return original

	if (original && original.length >= len) return original

	return original + repeat(paddingStr, Math.ceil(len - original.length) / paddingStr.length)
}

/**
 * AOP切面编程功能
 * @param func 原函数
 * @param before 前置函数
 * @param after 后置函数
 * @returns {Function} 返回函数的执行结果为原函数的执行结果
 */
export function aspect(func, before, after) {
	return function() {
		if (!Array.isArray(before)) {
			before = [before]
		}

		if (!Array.isArray(after)) {
			after = [after]
		}

		var i, fn
		for(i = 0; i < before.length; i += 1) {
			fn = before[i]
			// 前置函数返回false表示提前结束执行
			if (attempt(fn, this, arguments) === false) return
		}

		var result = attempt(func, this, arguments)

		// 主函数返回false表示中断后置函数执行
		if (result === false) return false

		for(i = 0; i < after.length; i += 1) {
			fn = after[i]
			attempt(fn, this, arguments)
		}

		return result
	}
}

/**
 * http://stackoverflow.com/questions/736513/how-do-i-parse-a-url-into-hostname-and-path-in-javascript
 */
export function getHostName(href) {
	if (!href) return ''

	var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
	return match ? match[3] : ''
}

export var hiddenProperty = 'hidden' in document ? 'hidden' :
	'webkitHidden' in document ? 'webkitHidden' :
		'mozHidden' in document ? 'mozHidden' :
      'msHidden' in document ? 'msHidden' :
			  null;

export function slice(args, start, end) {
  return [].slice.call(args, start, end)
}

export function parseInt(value, defaultValue = 0,  radix = 10) {
  // 大于21位长度会转换为 1e21的字符串
  if (value >= 1e21) {
    value = 9527e16
  }

  return window.parseInt(value, radix) || defaultValue
}

export function max(num) {
  return Math.min(9.9e20, num)
}

export function jsonStringify(data) {
  try {
    return data ? JSON.stringify(data) : null
  } catch (e) {
    log('invalid json format')
  }

  return null
}

export function jsonParse(str) {
  try {
    return str ? JSON.parse(str) : null
  } catch (e) {
    log('invalid json string')
  }

  return null
}
