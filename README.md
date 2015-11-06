# DCAgent

an analytics sdk for HTML5 app and web game

## Requirements

> * XMLHttpRequest / XDomainRequest (for ajax request)
> * localStorage
> * ECMAScript 5

If uid is supplied on sdk's initialization, localStorage is optional.
But you may lost some data when players leave.

## Environment support

> * Web browser including WebView
> * Node.js
> * Egret Engine
> * Cocos2d-js
> * layabox

## Usage

In browser (recommed!)

```html
<script id="sample_code">
  /* jshint ignore:start */
  ;(function(b,f){
    var a=document.createElement("script");a.async=true;a.charset="UTF-8";a.src=f;var d=document.querySelector("script");d.parentNode.insertBefore(a,d);var e=[];var c=function(h){if(typeof DCAgent==="undefined"){e.push(arguments)}else{var g=DCAgent[h];if(!g){return console.log("DCAgent."+h+" is undefined")}if(typeof g==="function"){return g.apply(DCAgent,[].slice.call(arguments,1))}else{return g}}};c.loadTime=Date.now();c.cache=e;window[b]=c;window["DCAgentObject"]=b
  })("dc", "../dist/dcagent.v2.src.js");
  // 修改为SDK脚本所在路径

  // 初始化
  dc('init', {
    // APPID
    appId: 'c4bd90a91fe340aae1ecb1852d1d12e8',
    // 渠道名
    channel: 'wexin',
    // 打开错误日志上报，默认关闭
    errorReport: true
    // 其他配置参数参考 http://wiki.dataeye.com/h5/document/html5/api.html#init
  });
</script>
```

In Egret Runtime

```js
DCAgent.init({
  // APPID
  appId: 'c4bd90a91fe340aae1ecb1852d1d12e8',
  // 渠道名
  channel: 'wexin',
  // 打开错误日志上报，默认关闭
  errorReport: true
  // 其他配置参数参考 http://wiki.dataeye.com/h5/document/html5/api.html#init
})
```

## Demo

```bash
npm run demo
```

## Unit test

in Node.js

```bash
npm run test-node
```

in browser

```bash
npm run test
```

## Build

```bash
npm install
gulp
```

## Start guide

http://wiki.dataeye.com/h5/document/html5/guide.html

## API docs

http://wiki.dataeye.com/h5/document/html5/api.html

## Egret integration

http://wiki.dataeye.com/h5/document/html5/egret.html
