'use strict'

import * as is from 'is_js'
import { Notification, NotificationOptions, NotificationState } from './Notification'
import { create2DCanvas, loadImage, imageToDataURI, TRANSPARENT_IMAGE } from './common'

export interface ImageNotificationOptions extends NotificationOptions {
  imageUrl: string
}

function blobToDataURI(blob: Blob) : Promise<string> {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.onload = e => resolve(<string> (<any> e.target).result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export class ImageNotification extends Notification<ImageNotificationOptions> {
  public experimental: boolean = false

  protected readonly finalType = 'image'

  protected readonly disallowOptions = [
  , 'items'
  , 'progress' // since chrome 30
  ]

  private originImageUrl: string
  private originImage: HTMLImageElement

  protected defaultOptions: ImageNotificationOptions = {
    type: this.finalType
  , title: ''
  , message: ''
  , iconUrl: Notification.DEFAULT_ICON_URL
  , imageUrl: Notification.DEFAULT_IMAGE_URL
  }

  protected optionsSetter = {
    imageUrl: (options: ImageNotificationOptions, prop: keyof ImageNotificationOptions, value: any): boolean => {
      if (is.string(value)) {
        options[prop] = value
        this._state = NotificationState.IDLE
        return true
      }
      return false
    }
  , defaultImageUrl: (options: ImageNotificationOptions, prop: keyof ImageNotificationOptions, value: any, receiver: any) : boolean => {
      if (is.string(value)) {
        options[prop] = value
        return true
      }
      return false
    }
  }

  private async scaleImage(img: HTMLImageElement) : Promise<string> {
    function tryCenteringImage() {
      let { canvas, ctx } = create2DCanvas(Notification.BEST_IMAGE_WIDTH, Notification.BEST_IMAGE_HEIGHT)
      if (img.width > Notification.BEST_IMAGE_WIDTH * 2) {
        let marginTop = (Notification.BEST_IMAGE_HEIGHT - img.height) / 2
        ctx.drawImage(img, 0, 0, canvas.width, img.height, 0, marginTop, canvas.width, canvas.height - 2 * marginTop)
      } else if (img.height > Notification.BEST_IMAGE_HEIGHT * 2) {
        let marginLeft = (Notification.BEST_IMAGE_WIDTH - img.width) / 2
        ctx.drawImage(img, 0, 0, img.width, canvas.height, marginLeft, 0, canvas.width - 2 * marginLeft, canvas.height)
      } else {
        ctx.drawImage(img, (Notification.BEST_IMAGE_WIDTH - img.width) / 2, (Notification.BEST_IMAGE_HEIGHT - img.height) / 2)
      }
      return canvas.toDataURL()
    }

    if (img.width > Notification.BEST_IMAGE_WIDTH && img.height > Notification.BEST_IMAGE_HEIGHT) {
      if (img.width / img.height > Notification.BEST_IMAGE_RATIO * 2) {
        let { canvas, ctx } = create2DCanvas(img.height * Notification.BEST_IMAGE_RATIO, img.height)
        ctx.drawImage(img, 0, 0, img.height * Notification.BEST_IMAGE_RATIO, img.height, 0, 0, canvas.width, canvas.height)
        return canvas.toDataURL()
      } else if (img.width / img.height < Notification.BEST_IMAGE_RATIO / 2) {
        let { canvas, ctx } = create2DCanvas(img.width, img.width / Notification.BEST_IMAGE_RATIO)
        ctx.drawImage(img, 0, 0, img.width, img.width / Notification.BEST_IMAGE_RATIO, 0, 0, canvas.width, canvas.height)
        return canvas.toDataURL()
      } else {
        let { canvas, ctx } = create2DCanvas(img.width, img.height)
        ctx.drawImage(img, 0, 0)
        return canvas.toDataURL()
      }
    } else {
      return tryCenteringImage()
    }
  }

  protected async init() : Promise<void> {
    await super.init()

    if (this.options.imageUrl) {
      try {
        this.originImageUrl = this.options.imageUrl
        this.originImage = await loadImage(this.originImageUrl)
        this.options.imageUrl = await this.scaleImage(this.originImage)
      } catch (e) {
        if (this.options.defaultImageUrl) {
          try {
            this.originImageUrl = this.options.defaultImageUrl
            this.originImage = await loadImage(this.originImageUrl)
            this.options.imageUrl = imageToDataURI(this.originImage)
          } catch (e) {
            this.options.imageUrl = TRANSPARENT_IMAGE
          }
        } else {
          this.options.imageUrl = TRANSPARENT_IMAGE
        }
      }
    } else {
      throw new Error('No avaliable image.')
    }
  }
}
