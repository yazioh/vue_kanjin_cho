/**
 * ステータス判定用
 */
const STATUS_YET = '_'
const STATUS_DONE = 'v'
const STATUS_DELETE = 'x'

/**
 * ブレイクダウンされたタスク
 */
export default class TASK {

  constructor (json = {}) {
    this.id = json.id || this.newID()
    this.TodoID = json.TodoID || ''
    this.label = json.label || 'any task'
    this.status = json.status || STATUS_YET
  }

  newID () {
    let d = new Date()
    return 'S' +
     ('' + d.getFullYear()).substr(-2) +
     ('00' + (1 + d.getMonth())).substr(-2) +
     ('00' + d.getDate()).substr(-2)
  }

  isDelete () {
    return (this.status === STATUS_DELETE)
  }
  isGoing () {
    return (this.status !== STATUS_DELETE)
  }
  isChecked () {
    return (this.status === STATUS_DONE)
  }

  checkd (flg) {
    this.status = (!flg || (flg === STATUS_YET)) ? STATUS_YET : STATUS_DONE
    return this.status
  }
}