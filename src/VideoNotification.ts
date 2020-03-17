'use strict'

import * as is from 'is_js'
import { Notification, NotificationOptions, NotificationState } from './Notification'
import { create2DCanvas, loadVideo } from './common'

export interface VideoNotificationOptions extends NotificationOptions {
  videoUrl: string
}

export class VideoNotification extends Notification<VideoNotificationOptions> {
  protected readonly finalType = 'image'

  protected readonly disallowOptions = [
  , 'items'
  , 'progress' // since chrome 30
  ]

  private originVideoUrl: string
  public originVideo: HTMLVideoElement

  private captureImage(video: HTMLVideoElement) : string {
    let { canvas, ctx } = create2DCanvas(video.height * VideoNotification.BEST_IMAGE_RATIO, video.width)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoWidth / VideoNotification.BEST_IMAGE_RATIO, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL()
  }

  protected defaultOptions: VideoNotificationOptions= {
    type: this.finalType
  , title: ''
  , message: ''
  , iconUrl: Notification.DEFAULT_ICON_URL
  , videoUrl: Notification.DEFAULT_IMAGE_URL
  }

  protected async init() : Promise<void> {
    await super.init()

    if (this.options.videoUrl) {
      this.originVideoUrl = this.options.videoUrl
      this.originVideo = await loadVideo(this.originVideoUrl)
      this.options.imageUrl = this.captureImage(this.originVideo)
      let lock = false
      this.originVideo.ontimeupdate = async () => {
        if (!lock && this.id) {
          lock = true
          this.options.imageUrl = this.captureImage(this.originVideo)
          await this.update()
          lock = false
        }
      }
    } else {
      throw new Error('No avaliable videoUrl.')
    }
  }

  protected optionsSetter = {
    videoUrl: (options: VideoNotificationOptions, prop: keyof VideoNotificationOptions, value: any): boolean => {
      if (is.string(value)) {
        options[prop] = value
        this._state = NotificationState.IDLE
        return true
      }
      return false
    }
  }

  public async create() : Promise<string> {
    if (!this.originVideo) {
      throw new Error('No avaliable video.')
    }

    await super.create()
    this.originVideo.play()
    return this.id
  }

  public async clear() : Promise<boolean> {
    this.originVideo.ontimeupdate = undefined
    this.originVideo.pause()
    this.originVideo = undefined
    return await super.clear()
  }
}
