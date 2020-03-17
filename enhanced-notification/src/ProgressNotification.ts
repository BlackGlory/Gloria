'use strct'

import * as is from 'is_js'
import { Notification, NotificationOptions } from './Notification'
import { CHROME_VERSION_MAIN } from './common'

export interface ProgressNotificationOptions extends NotificationOptions {
  progress: number // since chrome 30
}

export class ProgressNotification extends Notification<ProgressNotificationOptions> {
  protected readonly finalType = 'progress'

  protected readonly disallowOptions = [
    'imageUrl'
  , 'items'
  ]

  protected defaultOptions: ProgressNotificationOptions = {
    type: this.finalType
  , title: ''
  , message: ''
  , iconUrl: Notification.DEFAULT_ICON_URL
  , progress: 0
  }

  constructor(protected _options) {
    super(_options)
    if (CHROME_VERSION_MAIN < 30) {
      throw new Error('ProgressNotification needs Chrome 30 at least.')
    }
  }

  protected optionsSetter = {
    progress: (options: ProgressNotificationOptions, prop: keyof ProgressNotificationOptions, value: any): boolean => {
      if (is.above(value, 0) && is.under(value, 100)) {
        options[prop] = value
        return true
      }
      return false
    }
  }
}
