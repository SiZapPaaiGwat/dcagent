/**
 * 用户初始化配置
 */

import {version} from '../interface/version.js'
import * as defaults from '../defaults.js'

export default {
   accountId: '',
   accountType: '',
   age: defaults.DEFAULT_AGE,
   appId: '',
   appVersion: '',
   brand: '',
   channel: '',
   customDeviceId: '',
   gameServer: '',
   gender: defaults.DEFAULT_GENDER,
   idfa: '',
   imei: '',
   lonLat: '',
   mac: '',
   netType: defaults.DEFAULT_NET_TYPE,
   operator: '',
   osVersion: '',
   platform: defaults.DEFAULT_PLATFORM,
   resolution: '',
   roleClass: '',
   roleId: '',
   roleLevel: defaults.DEFAULT_ROLE_LEVEL,
   roleRace: '',
   simCardOp: '',
   uid: '',
   ver: version
}
