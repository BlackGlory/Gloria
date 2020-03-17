import * as is from 'is_js'
import axios from 'axios'
import parseFavicon from 'parse-favicon'
import { CHROME_VERSION_MAIN, TRANSPARENT_IMAGE } from './common'
import { loadImage, imageToDataURI } from './common'

export enum NotificationState {
  IDLE
, LOADING
, READY
, CREATED
}

export interface ButtonOptions extends chrome.notifications.ButtonOptions {
  onClick: () => void
}

export interface NotificationOptions extends chrome.notifications.NotificationOptions {
  onClick?: () => void
  onClose?: () => void
  url?: string
  buttons?: ButtonOptions[]
  autoCloseTime?: number | Date
  detectIcon?: boolean | string
  defaultIconUrl?: string
  requireInteraction?: boolean // since chrome 50
}

export type NotificationTypes = 'basic' | 'image' | 'list' | 'progress'

export abstract class Notification<T extends NotificationOptions> implements EventTarget {
  static readonly BEST_ICON_WIDTH = 80
  static readonly BEST_ICON_HEIGHT = 80
  static readonly BEST_ICON_RATIO = Notification.BEST_ICON_WIDTH / Notification.BEST_ICON_HEIGHT

  static readonly BEST_IMAGE_WIDTH = 360
  static readonly BEST_IMAGE_HEIGHT = 240
  static readonly BEST_IMAGE_RATIO = Notification.BEST_IMAGE_WIDTH / Notification.BEST_IMAGE_HEIGHT

  static readonly DEFAULT_ICON_URL = TRANSPARENT_IMAGE
  static readonly DEFAULT_IMAGE_URL = TRANSPARENT_IMAGE

  protected abstract readonly finalType: NotificationTypes

  protected optionsSetter: { [index: string]: (options: T, prop: string, value: any, receiver: any) => boolean } = {}

  protected readonly allowOptions: string[] = [
    'type'
  , 'iconUrl'
  , 'appIconMaskUrl' // since chrome 38
  , 'title'
  , 'message'
  , 'contextMessage'
  , 'eventTime'
  , 'requireInteraction' // since chrome 50
  , 'imageUrl'
  , 'items'
  , 'progress' // since chrome 30
  , 'buttons'
  , 'isClickable' // since chrome 32
  , 'priority'
  ]

  protected disallowOptions: string[] = []

  private originIconUrl: string
  private originIcon: HTMLImageElement

  public options: any = new Proxy({}, {
    set: (options: T, prop: string, value: any, receiver: any) : boolean => {
      let setter: { [index: string]: (options: T, prop: string, value: any, receiver: any) => boolean } = {
        defaultIconUrl: (options: T, prop: string, value: any, receiver: any) : boolean => {
          if (is.string(value)) {
            options[prop] = value
            return true
          }
          return false
        }
      , autoCloseTime: (options: T, prop: string, value: any, receiver: any) : boolean => {
          if ((is.number(value) && value > 0) || (is.date(value) && is.future(value))) {
            options[prop] = value
            return true
          }
          return false
        }
      , onClick: (options: T, prop: string, value: any, receiver: any) : boolean => {
          if (is.function(value) || is.undefined(value) || is.null(value)) {
            this.onclick = value
            return true
          }
          return false
        }
      , onButton1Click: (options: T, prop: string, value: any, receiver: any) : boolean => {
          if (is.function(value) || is.undefined(value) || is.null(value)) {
            this.onbutton1click = value
            return true
          }
          return false
        }
      , onButton2Click: (options: T, prop: string, value: any, receiver: any) : boolean => {
          if (is.function(value) || is.undefined(value) || is.null(value)) {
            this.onbutton2click = value
            return true
          }
          return false
        }
      , onClose: (options: T, prop: string, value: any, receiver: any) : boolean => {
          if (is.function(value) || is.undefined(value) || is.null(value)) {
            this.onclose = value
            return true
          }
          return false
        }
      , title: (options: T, prop: string, value: any, receiver: any) : boolean => {
          if (is.string(value) || is.undefined(value) || is.null(value)) {
            options[prop] = value
            return true
          }
          return false
        }
      , iconUrl: (options: T, prop: string, value: any, receiver: any) : boolean => {
          if (is.string(value)) {
            options[prop] = value
            this._state = NotificationState.IDLE
            return true
          } else if (is.undefined(value) || is.null(value)){
            options[prop] = value
            return true
          }
          return false
        }
      , appIconMaskUrl: (options: T, prop: string, value: any, receiver: any) : boolean => {
          if (is.string(value) || is.undefined(value) || is.null(value)) {
            options[prop] = value
            return true
          }
          return true
        }
      , message: (options: T, prop: string, value: any, receiver: any) : boolean => {
          if (is.string(value) || is.undefined(value) || is.null(value)) {
            options[prop] = value
            return true
          }
          return false
        }
      , contextMessage: (options: T, prop: string, value: any, receiver: any) : boolean => {
          if (is.string(value) || is.undefined(value) || is.null(value)) {
            options[prop] = value
            return true
          }
          return false
        }
      , eventTime: (options: T, prop: string, value: any, receiver: any) : boolean => {
          if (is.number(value) || is.undefined(value) || is.null(value)) {
            options[prop] = value
            return true
          }
          return false
        }
      , requireInteraction: (options: T, prop: string, value: any, receiver: any) : boolean => {
          if (is.boolean(value) || is.undefined(value) || is.null(value)) {
            options[prop] = value
            return true
          }
          return false
        }
      , buttons: (options: T, prop: string, value: any, receiver: any) : boolean => {
          if (is.array(value) && value.length <= 2) {
            for (let i in value) {
              if (is.function(value[i].onClick)) {
                options[`onButton${ i }Click`] = value[i].onClick
              }
            }
            options[prop] = value
            return true
          } else if (is.undefined(value) || is.null(value)) {
            options[prop] = value
            return true
          }
          return false
        }
      , isClickable: (options: T, prop: string, value: any, receiver: any) : boolean => {
          if (is.boolean(value) || is.undefined(value) || is.null(value)) {
            options[prop] = value
            return true
          }
          return false
        }
      , priority: (options: T, prop: string, value: any, receiver: any) : boolean => {
          if (is.number(value) || is.undefined(value) || is.null(value)) {
            options[prop] = value
            return true
          }
          return false
        }
      }

      return (this.optionsSetter[prop] || setter[prop] || ((options: T, prop: string, value: any, receiver: any) : boolean => {
        options[prop] = value
        return true
      }))(options, prop, value, receiver)
    }
  })
  protected abstract defaultOptions: T

  protected _state: NotificationState = NotificationState.IDLE
  get state() : NotificationState {
    return this._state
  }
  set state(value: NotificationState) {}

  protected _id: string = null
  get id() : string {
    return this._id
  }
  set id(value: string) {}

  private onclick: () => void
  private onclose: () => void
  private onbutton1click: () => void
  private onbutton2click: () => void
  private events: { [index: string]: EventListenerOrEventListenerObject[] } = {}

  constructor(protected _options: T) {}

  private async detectIcon(url: string) : Promise<string> {
    let { data: html } = await axios(url)
      , iconList = await parseFavicon(html, { baseURI: url, allowUseNetwork: true, allowParseImage: true, timeout: 1000 * 30 })

    if (iconList) {
      iconList = iconList.filter(icon => {
        if (icon.size) {
          let [width, height] = icon.size.split('x').map(Number)
          return width >= Notification.BEST_ICON_WIDTH && height >= Notification.BEST_ICON_HEIGHT
        } else {
          return false
        }
      })
      if (iconList.length > 0) {
        let icon = iconList.reduce((result, current) => {
          if (result.size) {
            let [resultWidth, resultHeight] = result.size.split('x').map(Number)
              , [currentWidth, currentHeight] = current.size.split('x').map(Number)
            if (Math.abs(resultWidth / resultHeight - Notification.BEST_ICON_RATIO) > Math.abs(currentWidth / currentHeight - Notification.BEST_ICON_RATIO)) {
              return current
            }
          }
          return result
        }, iconList[0])
        return icon.url
      }
    }
    return null
  }

  public addEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
    if (is.string(type)) {
      type = type.toLowerCase()
    } else {
      throw new Error('Event type must be a string.')
    }

    if (is.array(this.events[type]) && !this.events[type].includes(listener)) {
      this.events[type].push(listener)
    } else {
      this.events[type] = [listener]
    }
  }

  public removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
    if (is.string(type)) {
      type = type.toLowerCase()
    } else {
      throw new Error('Event type must be a string.')
    }

    if (is.array(this.events[type])) {
      let index = this.events[type].indexOf(listener)
      if (index) {
        this.events[type].splice(index, 1)
      }
    }
  }

  public dispatchEvent(evt: CustomEvent): boolean {
    let type = evt.type.toLowerCase()
    if (is.array(this.events[type])) {
      this.events[type]
      .filter(is.function)
      .forEach(fn => (<any> fn)(...evt.detail))
    }
    if (is.function(this[`on${ type }`])) {
      this[`on${ type }`]()
    }
    return true
  }

  public format(options) {
    let strictOptions: any = {}
    for (let key of Object.keys(options)) {
      if (this.allowOptions.includes(key) && !this.disallowOptions.includes(key)) {
        strictOptions[key] = options[key]
      }
    }

    if (CHROME_VERSION_MAIN < 30) {
      delete strictOptions.progress
      delete strictOptions.isClickable
    }

    if (CHROME_VERSION_MAIN < 38) {
      delete strictOptions.appIconMaskUrl
    }

    if (CHROME_VERSION_MAIN >= 50) {
      if (is.number(options.autoCloseTime) || is.date(options.autoCloseTime)) {
        strictOptions.requireInteraction = true
      }
    } else {
      delete strictOptions.requireInteraction
    }

    return Object.assign({}, this.defaultOptions, strictOptions)
  }

  protected async init() : Promise<void> {
    Object.assign(this.options, this._options)

    let targetUrl = this.options.url

    if (is.string(targetUrl)) {
      if (!this.onclick) {
        this.options.onClick = async () => {
          chrome.tabs.query({ url: targetUrl.replace(/^https?/, '*') }, tabs => {
            if (!chrome.runtime.lastError && tabs[0]) {
              chrome.tabs.highlight({ windowId: tabs[0].windowId, tabs: tabs[0].index }, window => {})
            } else {
              chrome.windows.getCurrent({ windowTypes: ['normal'] }, window => {
                if (!chrome.runtime.lastError && window) {
                  chrome.tabs.create({ url: targetUrl })
                } else {
                  chrome.windows.create(window => {
                    chrome.tabs.create({ url: targetUrl, windowId: window.id })
                  })
                }
              })
            }
          })
          await this.clear()
        }
      }

      if (this.options.detectIcon === true) {
        try {
          let iconUrl = await this.detectIcon(targetUrl)
          if (iconUrl) {
            this.options.iconUrl = iconUrl
          }
        } catch (e) {
          console.error(e)
        }
      }
    }

    if (is.string(this.options.detectIcon)) {
      try {
        let iconUrl = await this.detectIcon(this.options.detectIcon)
        if (iconUrl) {
          this.options.iconUrl = iconUrl
        }
      } catch (e) {
        console.error(e)
      }
    }

    if (this.options.iconUrl) {
      try {
        this.originIconUrl = this.options.iconUrl
        this.originIcon = await loadImage(this.originIconUrl)
        this.options.iconUrl = imageToDataURI(this.originIcon)
      } catch (e) {
        if (this.options.defaultIconUrl) {
          try {
            this.originIconUrl = this.options.defaultIconUrl
            this.originIcon = await loadImage(this.originIconUrl)
            this.options.iconUrl = imageToDataURI(this.originIcon)
          } catch (e) {
            this.options.iconUrl = TRANSPARENT_IMAGE
          }
        } else {
          this.options.iconUrl = TRANSPARENT_IMAGE
        }
      }
    }
  }

  private buttonClickHandler = (id, buttonIndex) => {
    if (id === this.id) {
      this.dispatchEvent(new CustomEvent(`Button${ buttonIndex }Click`, {
        bubbles: false
      , cancelable: false
      , detail: [buttonIndex]
      }))
      chrome.notifications.onButtonClicked.removeListener(this.buttonClickHandler)
    }
  }

  private closeHandler = id => {
    if (id === this.id) {
      this._state = NotificationState.READY
      this.dispatchEvent(new CustomEvent('Close', {
        bubbles: false
      , cancelable: false
      }))
      chrome.notifications.onClosed.removeListener(this.closeHandler)
    }
  }

  private clickHandler = id => {
    if (id === this.id) {
      this.dispatchEvent(new CustomEvent('Click', {
        bubbles: false
      , cancelable: false
      }))
      chrome.notifications.onClosed.removeListener(this.clickHandler)
    }
  }

  public create() : Promise<string> {
    return new Promise(async (resolve, reject) => {
      if (this.state === NotificationState.IDLE) {
        this._state = NotificationState.LOADING
        await this.init()
        this._state = NotificationState.READY
      }
      if (this.state === NotificationState.READY) {
        chrome.notifications.create(this.format(this.options), id => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError)
          }

          chrome.notifications.onClosed.addListener(this.closeHandler)
          chrome.notifications.onClicked.addListener(this.clickHandler)
          chrome.notifications.onButtonClicked.addListener(this.buttonClickHandler)

          if (CHROME_VERSION_MAIN >= 50 && this.options.autoCloseTime) {
            if (is.number(this.options.autoCloseTime)) {
              setTimeout(this.clear, this.options.autoCloseTime)
            } else if (is.date(this.options.autoCloseTime)) {
              let timeout = this.options.autoCloseTime.getTime() - new Date().getTime()
              if (timeout > 0) {
                setTimeout(this.clear, timeout)
              }
            }
          }

          this._id = id
          this._state = NotificationState.CREATED

          resolve(id)
        })
      }
    })
  }

  public update() : Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (this.state === NotificationState.IDLE) {
        return reject(new Error('notification is not ready'))
      }
      if (this.state === NotificationState.READY) {
        await this.create()
      } else if (this.state === NotificationState.CREATED) {
        chrome.notifications.update(this.id, this.format(this.options), wasUpdated => {
          if (chrome.runtime.lastError) {
            return reject(chrome.runtime.lastError)
          }
          resolve(wasUpdated)
        })
      }
    })
  }

  public clear() : Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.id) {
        return reject(new Error('Cannot call clear() becasue this notification is not created.'))
      }
      chrome.notifications.clear(this.id, wasCleared => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError)
        }

        chrome.notifications.onClosed.removeListener(this.closeHandler)
        chrome.notifications.onClicked.removeListener(this.clickHandler)
        chrome.notifications.onButtonClicked.removeListener(this.buttonClickHandler)

        this._id = undefined

        this._state = NotificationState.READY

        resolve(wasCleared)
      })
    })
  }
}
