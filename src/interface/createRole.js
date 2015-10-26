import setRoleInfo from './setRoleInfo.js'
import onEvent from './onEvent.js'

/**
 * 创建角色
 * 参数依次为id, race, class, level
 */
export default function createRole(roleID, roleRace, roleClass, roleLevel) {
  setRoleInfo(roleID, roleRace, roleClass, roleLevel)

  onEvent('DE_EVENT_CREATE_ROLE', {
    roleId: String(roleID),
    roleRace: String(roleRace),
    roleClass: String(roleClass)
  })
}
