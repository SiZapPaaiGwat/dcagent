import config from '../utils/initConfig.js'
import * as CONST from '../consts.js'
import * as utils from '../libs/utils.js'

/**
 * 设置角色信息
 * 如果角色已经创建则每次都要设置角色信息
 * 参数依次为id, race, class, level
 */
export default function setRoleInfo(roleID, roleRace, roleClass, roleLevel) {
  CONST.ACCOUNT_ROLE_SETTINGS.split(',').forEach((x, i) => config[x] = arguments[i] || '')

  config.roleLevel = utils.parseInt(roleLevel) || 1
}
