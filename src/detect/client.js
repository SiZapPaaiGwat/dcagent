/**
 * 识别客户端的基本环境
 */

import {window, document, location} from '../globals.js'
import hasDOM from '../libs/hasDOM.js'
import {engine} from './engine.js'

var hasStorage = !!window.localStorage || engine.isEgret || engine.isCocos || engine.isLayabox
var isStandardBrowser = hasDOM()
var hasCookie = isStandardBrowser && ('cookie' in document)
var protocol = location.protocol === 'https:' ? 'https:' : 'http:'

export {hasStorage, isStandardBrowser, hasCookie, protocol}
