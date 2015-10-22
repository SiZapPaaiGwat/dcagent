/**
 * SDK内部使用的顶层对象及其主要对象
 * 不同环境下区别很大
 * 比如白鹭引擎真正的顶层对象是__global，但是window也不为空
 * 所以这里要抛弃针对网页属性检测的一些传统方案
 */

 // avoid bad invocation
/*jshint -W067*/
// 严格模式获取顶层对象
// http://stackoverflow.com/questions/9642491/getting-a-reference-to-the-global-object-in-an-unknown-environment-in-strict-mod
var topThis = (1, eval)('this');
/*jshint +W067*/

export var win = topThis || {}
export var doc = topThis.document || {}
export var loc = topThis.location || {}
