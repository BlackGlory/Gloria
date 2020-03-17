'use strict'

import * as Notifications from '../src/enhanced-notification'

let notification: Notifications.Notification<Notifications.NotificationOptions> = null

function log(info: string) {
  let output = <HTMLTextAreaElement> document.querySelector('#output')
  output.value = `${ info }\n${ output.value }`
}

;(<HTMLButtonElement> document.querySelector('#create')).addEventListener('click', async () => {
  try {
    let type = (<HTMLSelectElement> document.querySelector('#type')).value
      , options = <{ [index: string]: any }> eval('(' + (<HTMLTextAreaElement> document.querySelector('#options')).value + ')')
    notification = new Notifications[type](options)
    await notification.create()
  } catch(e) {
    log(e.message)
    console.error(e)
  }
})

;(<HTMLButtonElement> document.querySelector('#update')).addEventListener('click', async () => {
  try {
    let options = eval('(' + (<HTMLTextAreaElement> document.querySelector('#options')).value + ')')
    Object.assign(notification.options, options)
    await notification.update()
  } catch(e) {
    log(e.message)
    console.error(e)
  }
})

;(<HTMLButtonElement> document.querySelector('#clear')).addEventListener('click', async () => {
  try {
    await notification.clear()
  } catch(e) {
    log(e.message)
    console.error(e)
  }
})
