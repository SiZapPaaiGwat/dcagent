import config from '../utils/initConfig.js'

/**
 * @param gender {Number} 2为女性，1位男性
 */
export default function setGender(gender) {
  config.gender = gender === 2 ? 2 : 1
}
