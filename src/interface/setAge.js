import * as utils from '../libs/utils.js'
import config from '../utils/initConfig.js'


/**
 * @param age {Number} 1~128
 */
export default function setAge(age) {
	age = utils.parseInt(age)
  config.age = age > 0 && age < 128 ? age : 0
}
