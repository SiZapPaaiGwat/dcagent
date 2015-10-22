/**
 * 识别客户端的基本环境
 */

import {win as window, doc as document} from '../globals.js'
import hasDOM from '../libs/hasDOM.js'
import {engine} from './engine.js'

var hasStorage = !!window.localStorage || engine.isEgret || engine.isCocos || engine.isLayabox
var isStandardBrowser = hasDOM()
var hasCookie = isStandardBrowser && ('cookie' in document)

export {hasStorage, isStandardBrowser, hasCookie}
