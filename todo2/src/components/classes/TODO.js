// 依存関係
import TASK from './TASK.js'

/**
 * ステータス判定用
 */
const STATUS_OK = 'o'
const STATUS_DELETE = 'x'

/**
 * TODO やることヘッダー
 */
export default class TODO {
  constructor (json = {}) {
    this.id = json.id || this.newID()
    this.title = json.title || 'any todo'
    this.area = json.area || 'a4'
    this.unitTime = json.unitTime || 15
    this.remarks = json.remarks || ''
    this.tasks = json.tasks || [new TASK({TodoID: this.id})]
    this.status = json.status || STATUS_OK
  }

  newID () {
    let d = new Date()
    return 'D' +
     ('' + d.getFullYear()).substr(-2) +
     ('00' + (1 + d.getMonth())).substr(-2) +
     ('00' + d.getDate()).substr(-2)
  }

  isDelete () {
    return (this.status === STATUS_DELETE)
  }
}
