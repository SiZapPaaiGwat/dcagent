/**
 * 主流引擎列表
 * https://html5gameengine.com/
 */

import {win as window} from '../globals.js'

export var engine =  {
  isEgret: !!window.egret,
  isLayabox: !!window.layabox,
  isCocos: !!window.cc && window.cc.game
}

// 当前页面使用的引擎
var engineName
// SDK若在引擎之前加载，开始获取到的引擎名称可能为空。所以要多尝试几次
var retryTimes = 0

/**
 * 获取当前引擎名称
 */
export default function() {
  if (engineName) return engineName

  retryTimes += 1
  if (retryTimes > 4) return

  // egret和layabox在supports已经检测直接使用
  var engines = {
    egret: 'egret',
    layabox: 'layabox',
    // http://www.cocos2d-x.org/reference/html5-js/V3.6/index.html
    cocos: 'cc.game',
    impact: 'ig',
    phaser: 'Phaser',
    pixi: 'PIXI',
    create: 'createjs',
    three: 'THREE',
    gameMaker: 'asset_get_type',
    playCanvas: 'pc.fw',
    // http://biz.turbulenz.com/sample_assets/2dcanvas.js.html
    turbulenz: 'TurbulenzEngine',
    // http://www.html5quintus.com/#demo
    quintus: 'Quintus',
    // https://github.com/melonjs/melonJS
    melon: 'me.game',
    // https://github.com/LazerUnicorns/lycheeJS
    lychee: 'lychee',
    // http://www.clockworkchilli.com/index.php/developers/snippet/1
    wade: 'wade.addSceneObject',
    // http://craftyjs.com/
    crafty: 'Crafty',
    // https://github.com/digitalfruit/limejs
    lime: 'lime.Scene',
    // https://github.com/wise9/enchant.js
    enchant: 'enchant',
    // http://www.isogenicengine.com/docs-reference.html#IgeEngine
    isogenic: 'IgeEngine',
    // http://docs.gameclosure.com/example/advrendering-tiles/index.html
    gameclosure: 'GC.Application',
    // http://www.pandajs.net/docs/files/src_engine_scene.js.html#l11
    panda: 'game.Scene',
    // http://www.api.kiwijs.org/
    kiwi: 'Kiwi',
    // https://github.com/ippa/jaws
    jaws: 'jaws',
    // http://sirius2d.com/doc/
    sirius2d: 'ss2d',
    // http://jindo.dev.naver.com/collie/doc/index.html?l=en
    collie: 'collie',
    // https://github.com/wellcaffeinated/PhysicsJS/
    physics: 'Physics',
    // https://github.com/piqnt/stage.js
    stage: 'Stage.Anim',
    // https://github.com/BabylonJS/Babylon.js
    babylon: 'BABYLON'
  }

  for(var key in engines) {
    var namespace = engines[key]

    // 有些引擎的namespace过于通用会进行一次深度属性检测
    if (namespace.indexOf('.') > -1) {
      var props = namespace.split('.')
      var field = window[props[0]]

      if (field && field[props[1]]) {
        engineName = key
        return key
      }
    } else {
      if (window[namespace]) {
        engineName = key
        return key
      }
    }
  }
}
