'use strict'

import * as is from 'is_js'
import { Notification, NotificationOptions } from './Notification'

export interface ListNotificationOptions extends NotificationOptions {
  items: chrome.notifications.ItemOptions[]
}

export class ListNotification extends Notification<ListNotificationOptions> {
  protected readonly finalType = 'list'

  protected readonly disallowOptions = [
  , 'imageUrl'
  , 'progress' // since chrome 30
  ]

  protected defaultOptions: ListNotificationOptions = {
    type: this.finalType
  , title: ''
  , message: ''
  , iconUrl: Notification.DEFAULT_ICON_URL
  , items: []
  }

  protected optionsSetter = {
    items: (options: ListNotificationOptions, prop: keyof ListNotificationOptions, value: any): boolean => {
      if (is.array(value)) {
        options[prop] = value
        return true
      }
      return false
    }
  }
}
