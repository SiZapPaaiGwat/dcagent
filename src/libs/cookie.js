import {document} from '../globals.js'

const Cookie = {
  get: (name) => {
    var reg = '(^|)\\s*' + name + '=([^\\s]*)'
    var c = document.cookie.match(new RegExp(reg))

    return c && c.length >= 3 ? decodeURIComponent(c[2]) : null
  },
  set: (name, value, days, domain, path, secure) => {
    var d
    if (days) {
      d = new Date()
      d.setTime(d.getTime() + (days * 8.64e7))
    }
    var expiresStr = days ? ' expires=' + d.toGMTString() : ''
    var pathStr = ' path=' + (path || '/')
    var domainStr = domain ? ' domain=' + domain : ''
    var secureStr = secure ? ' secure' : ''
    document.cookie = name + '=' + encodeURIComponent(value) + expiresStr + pathStr + domainStr + secureStr
  },
  remove: function(name, domain, path) {
    Cookie.set(name, '', -1, domain, path)
  }
}

export default Cookie
