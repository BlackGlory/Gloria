'use strict'

import * as is from 'is_js'
import { Notification, NotificationOptions } from './Notification'

export interface BasicNotificationOptions extends NotificationOptions {}

export class BasicNotification extends Notification<BasicNotificationOptions> {
  protected readonly finalType = 'basic'

  protected readonly disallowOptions = [
    'imageUrl'
  , 'items'
  , 'progress' // since chrome 30
  ]

  protected defaultOptions: BasicNotificationOptions = {
    type: this.finalType
  , title: ''
  , message: ''
  , iconUrl: Notification.DEFAULT_ICON_URL
  }
}
